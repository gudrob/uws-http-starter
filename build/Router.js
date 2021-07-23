"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const RequestData_1 = __importDefault(require("./RequestData"));
class Router {
    constructor(app) {
        this.app = app;
        this.middlewareStack = [];
        this.groupStack = [];
        this.routes = [];
    }
    middleware(middleware, sub) {
        this.middlewareStack.push(middleware);
        sub();
        this.middlewareStack.pop();
    }
    group(groupName, sub) {
        this.groupStack.push(groupName.toLowerCase());
        sub();
        this.groupStack.pop();
    }
    endpoint(handler) {
        this.groupStack.push(handler.name.toLowerCase());
        let path = "/" + this.groupStack.join('/');
        this.groupStack.pop();
        let currentHandler = handler;
        this.middlewareStack.forEach(middlewareUsed => {
            let referencedHandler = currentHandler;
            currentHandler = (request, response) => {
                middlewareUsed(request, response, referencedHandler);
            };
        });
        this.routes.push(path);
        this.app.any(path, (res, req) => {
            res.onAborted(() => {
                res.tryEnd('Request aborted', 32);
            });
            let headers = {};
            req.forEach((headerKey, headerValue) => {
                headers[headerKey] = headerValue;
            });
            let body = '';
            res.onData((data, isLast) => __awaiter(this, void 0, void 0, function* () {
                body += data;
                if (isLast) {
                    currentHandler(new RequestData_1.default(headers, body), res);
                }
            }));
        });
    }
    getRoutes() {
        return this.routes;
    }
}
exports.Router = Router;
