import RequestData from "./RequestData";
import { HttpResponse } from "./uws";

export default class Controller {

    public static async(req: RequestData, response: HttpResponse) {
        setTimeout(() => {
            response.end('Hello World! Async!');
        }, 100);
    }

    public static hello(req: RequestData, response: HttpResponse) {
        response.end('Hello World!');
    }

    public static me(req: RequestData, response: HttpResponse) {
        response.end('It\'s a me!');
    }
}