"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleMiddleware = void 0;
let ExampleMiddleware = function (request, response, next) {
    response.writeStatus("202 Accepted");
    next(request, response, next);
};
exports.ExampleMiddleware = ExampleMiddleware;
