"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    static async(req, response) {
        setTimeout(() => {
            response.end('Hello World! Async!');
        }, 100);
    }
    static hello(req, response) {
        response.end('Hello World!');
    }
    static me(req, response) {
        response.end('It\'s a me!');
    }
}
exports.default = Controller;
