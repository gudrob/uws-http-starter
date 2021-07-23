import { HttpRequest, HttpResponse, TemplatedApp } from "./uws";
import Dictionary from "./Dictionary";
import NextFunction from "./NextFunction";
import RequestData from "./RequestData";

/**
 * A simple router that keeps your app file structured by using a
 * function stack approach for middleware. It's currently pretty
 * much meant for a POST-only api since it does not handle query strings
 */
export class Router {
    private middlewareStack: Array<(request: RequestData, response: HttpResponse, next: NextFunction) => void> = [];
    private groupStack: Array<string> = [];

    private routes: Array<string> = [];

    constructor(private app: TemplatedApp) { }

    /**
     * Adds a new middleware handler that is executed before the stack in the sub parameter.
     * Can be a request preprocessor or prematurely end the response like for example an authentication middleware
     * @param middleware
     * @param sub 
     */
    middleware(middleware: (request: RequestData, response: HttpResponse, next: NextFunction) => void, sub: () => void): void {
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
     * Adds an endpoint with a handler to be executed
     * @param groupName the name of the group, e.g. "user" becomes "/user/" 
     * @param sub the stack called on this route
     */
    endpoint(handler: (request: RequestData, response: HttpResponse) => void): void {

        //Route is created from the groups currently on the stack plus the handlers name
        this.groupStack.push(handler.name.toLowerCase());
        let path = "/" + this.groupStack.join('/');
        this.groupStack.pop();

        //Middlewares currently on the stack are wrapped around the handler
        let currentHandler = handler;
        this.middlewareStack.forEach(middlewareUsed => {
            let referencedHandler = currentHandler;
            currentHandler = (request: RequestData, response: HttpResponse) => {
                middlewareUsed(request, response, referencedHandler);
            }
        });

        this.routes.push(path);

        //Path is assigned, ignoring request type
        this.app.any(path, (res: HttpResponse, req: HttpRequest) => {

            //An abort handler is required by uws
            res.onAborted(() => {
                res.tryEnd('Request aborted', 32);
            });

            let headers: Dictionary<string> = {};
            req.forEach((headerKey, headerValue) => {
                headers[headerKey] = headerValue;
            });

            let body = '';
            res.onData(async (data: ArrayBuffer, isLast: boolean) => {
                body += data;

                if (isLast) {
                    currentHandler(
                        new RequestData(
                            headers,
                            body),
                        res);
                }
            });
        })
    }

    getRoutes() {
        return this.routes;
    }
}