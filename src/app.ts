import Controller from "./Controller";
import { ExampleMiddleware } from "./ExampleMiddleware";
import { Router } from "./Router";
import { TemplatedApp } from "./uws";
import uws from './uws/uws';


let app: TemplatedApp = uws.App({
    //Add your SSL config here if needed
    //See the μWebSockets.js docs for more info
});
let router = new Router(app);
let port = 8080;

router.group('examples', () => {
    router.endpoint(Controller.async);
    router.endpoint(Controller.hello);
    router.middleware(ExampleMiddleware, () => {
        router.endpoint(Controller.me);

    });
});

console.log(router.getRoutes());

app.listen(port, (isListening) => {
    console.log(isListening ? `Listening on port ${port}!` : `Error: Could not listen on port ${port}!`)
})