import { RequestData, NextFunction } from "uws-router";

/**
 * An example middleware adding a string to the response
 * @param request 
 * @param response 
 * @param next 
 */
let ExampleMiddleware1 = function (request: RequestData, next: NextFunction): void {
    request.write('ExampleMiddleware1 called! ')
    next(request);
}

export { ExampleMiddleware1 };