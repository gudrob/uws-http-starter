import RequestData from "../http/RequestData";
import { NextFunction } from "../http/NextFunction";

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