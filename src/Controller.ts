import RequestData from "./RequestData";
import { HttpResponse } from "uWebSockets.js";

export default class Controller {

    public static async(req: RequestData, response: HttpResponse) {
        setTimeout(() => {
            response.end('Controller.async called!');
        }, 100);
    }

    public static sync(req: RequestData, response: HttpResponse) {
        response.end('Controller.sync called!');
    }

    public static middleware(req: RequestData, response: HttpResponse) {
        response.end('Controller.middleware called!');
    }
}