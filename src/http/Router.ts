import { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";
import Dictionary from "../misc/Dictionary";
import { NextFunction } from "./NextFunction";
import RequestData from "./RequestData";
import * as fs from 'fs';

/**
 * A simple router that keeps your app file structured by using a
 * function stack approach for middleware. It's currently pretty
 * much meant for a POST-only api since it does not handle query strings
 */
export class Router {
    private middlewareStack: Array<(request: RequestData, next: NextFunction) => void> = [];
    private groupStack: Array<string> = [];

    private routes: Array<string> = [];

    constructor(private app: TemplatedApp) { }

    private getHttpMethod(method: string): string {
        if (method === 'del') {
            return 'DELETE'
        }
        return method.toUpperCase();
    }

    /**
     * Adds a new middleware handler that is executed before the stack in the sub parameter.
     * Can be a request preprocessor or prematurely end the response like for example an authentication middleware
     * @param middleware
     * @param sub 
     */
    middleware(middleware: (request: RequestData, next: NextFunction) => void, sub: () => void): void {
        this.middlewareStack.push(middleware);
        sub();
        this.middlewareStack.pop();
    }


    /**
     * Adds a new group to the routes in sub
     * @param groupName the name of the group, e.g. "user" becomes "/user/" 
     * @param sub the stack called on this route
     */
    group(groupName: string, sub: () => void): void {
        this.groupStack.push(groupName.toLowerCase());
        sub();
        this.groupStack.pop();
    }

    /**
     * Adds a get endpoint that serves a file.
     * Reloads the file from disc when cacheDuration is reached
     * @param file the absolute file path 
     * @param alias the route's name
     * @param cacheDuration the time to wait before refreshing from storage in ms
     */
    private cached: Dictionary<{ time: number, data: Buffer }> = {};
    serveFile(file: string, alias: string, cacheDuration: number = 10000) {
        this.endpoint('get', (request: RequestData) => {
            let cached = this.cached[file];

            if (cached && cached.time > Date.now() - cacheDuration) {
                request.end(cached.data);
            } else {
                fs.readFile(file, (err, data) => {
                    if (err) throw err;
                    this.cached[file] = {
                        time: Date.now(),
                        data
                    }
                });
            }
        }, alias);
    }

    /**
     * Adds an endpoint with a handler to be executed
     * @param groupName the name of the group, e.g. "user" becomes "/user/" 
     * @param sub the stack called on this route
     * @param alias optional, will override the handlers name for the route
     */
    endpoint(method: 'del' | 'patch' | 'post' | 'get' | 'put' | 'head' | 'options', handler: (request: RequestData) => void, alias: string | undefined = undefined): void {

        //Route is created from the groups currently on the stack plus the handlers name
        this.groupStack.push(alias ? alias : handler.name.toLowerCase());
        let path = "/" + this.groupStack.join('/');
        this.groupStack.pop();

        //Middlewares currently on the stack are wrapped around the handler
        let currentHandler = handler;
        this.middlewareStack.forEach(middlewareUsed => {
            let referencedHandler = currentHandler;
            currentHandler = (request: RequestData) => {
                middlewareUsed(request, referencedHandler);
            }
        });

        this.routes.push(`${method}: ${path}`);

        //Path is assigned, ignoring request type
        this.app[method](path, (res: HttpResponse, req: HttpRequest) => {

            //An abort handler is required by uws as the response will not be available after connection termination
            res.onAborted(() => res._hasEnded = true);

            let headers: Dictionary<string> = {};
            req.forEach((headerKey, headerValue) => {
                headers[headerKey] = headerValue;
            });

            let body = Buffer.from('');
            let query = req.getQuery();
            res.onData(async (data: ArrayBuffer, isLast: boolean) => {
                body = Buffer.concat([body, Buffer.from(data)]);

                if (isLast) {
                    currentHandler(
                        new RequestData(
                            headers,
                            this.getHttpMethod(method),
                            body.toString(),
                            query,
                            res));
                }
            });
        })
    }

    getRoutes() {
        return this.routes;
    }
}