import NextFunction from "./NextFunction";
import RequestData from "./RequestData";
import { HttpResponse } from "uWebSockets.js";

/**
 * An example middleware adding a status code to the response
 * @param request 
 * @param response 
 * @param next 
 */
let ExampleMiddleware1 = function (request: RequestData, response: HttpResponse, next: NextFunction): void {
    response.write('ExampleMiddleware1 called! ')
    next(request, response);
}

export { ExampleMiddleware1 };