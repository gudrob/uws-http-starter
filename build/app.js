"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const ExampleMiddleware_1 = require("./ExampleMiddleware");
const Router_1 = require("./Router");
const uws_1 = __importDefault(require("./uws/uws"));
let app = uws_1.default.App({});
let router = new Router_1.Router(app);
let port = 8080;
router.group('examples', () => {
    router.endpoint(Controller_1.default.async);
    router.endpoint(Controller_1.default.hello);
    router.middleware(ExampleMiddleware_1.ExampleMiddleware, () => {
        router.endpoint(Controller_1.default.me);
    });
});
console.log(router.getRoutes());
app.listen(port, (isListening) => {
    console.log(isListening ? `Listening on port ${port}!` : `Error: Could not listen on port ${port}!`);
});
