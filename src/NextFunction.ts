import { HttpResponse } from "uWebSockets.js";
import RequestData from "./RequestData";

/**
 * Wraps the request handler so we can assign middleware to it
 */
export default interface NextFunction {
    (request: RequestData, response: HttpResponse): void;
}
