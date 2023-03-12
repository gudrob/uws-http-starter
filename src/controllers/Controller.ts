import { RequestData } from "uws-router";

export default class Controller {

    public static async(req: RequestData) {
        setTimeout(() => {
            req.end('Hello World! Async!');
        }, 100);
    }

    public static sync(req: RequestData) {
        req.end('Hello World!');
    }

    public static middleware(req: RequestData) {
        req.end('Passed through 2 middlewares');
    }
}