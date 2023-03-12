import { RequestData, NextFunction } from "uws-router";

/**
 * An example middleware adding a status code to the response
 * @param request 
 * @param next 
 */
let ExampleMiddleware = function (request: RequestData, next: NextFunction): void {
    request.writeStatus("202 Accepted");
    next(request);
}

export { ExampleMiddleware };