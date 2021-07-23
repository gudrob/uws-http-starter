import NextFunction from "./NextFunction";
import RequestData from "./RequestData";
import { HttpResponse } from "./uws";

/**
 * An example middleware adding a status code to the response
 * @param request 
 * @param response 
 * @param next 
 */
let ExampleMiddleware = function (request: RequestData, response: HttpResponse, next: NextFunction): void {
    response.writeStatus("202 Accepted");
    next(request, response, next);
}

export { ExampleMiddleware };