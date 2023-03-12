import { RequestData, NextFunction } from "uws-router";

/**
 * An example middleware adding a string to the response
 * @param request 
 * @param next 
 */
export const ExampleMiddleware2 = function (request: RequestData, next: NextFunction): void {
    request.write('ExampleMiddleware2 called! ')
    next(request);
}