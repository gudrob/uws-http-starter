import { NextFunction } from "../http/NextFunction";
import RequestData from "../http/RequestData";

/**
 * An example middleware adding a string to the response
 * @param request 
 * @param response 
 * @param next 
 */
let ExampleMiddleware1 = function (request: RequestData, next: NextFunction) {
    request.write('ExampleMiddleware1 called! ')
    next(request);
}

export { ExampleMiddleware1 };