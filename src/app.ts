import Controller from "./controllers/Controller";
import { Router } from "./http/Router";
import { TemplatedApp } from "uWebSockets.js";
import uws from 'uWebSockets.js';
import { ExampleMiddleware1 } from "./middleware/ExampleMiddleware1";
import { ExampleMiddleware2 } from "./middleware/ExampleMiddleware2";

let app: TemplatedApp = uws.App({
    //Use SSLApp and add your SSL config here if needed
    //See the μWebSockets.js docs for more info
    //cert_file_name: 'server.cert',
    //key_file_name: 'server.key'
});

let router = new Router(app);
let port = 8080;

router.endpoint('get', Controller.async);

router.group('examples', () => {

    router.endpoint('get', Controller.sync);

    router.middleware(ExampleMiddleware1, () => {

        router.endpoint('post', Controller.async);

        router.middleware(ExampleMiddleware2, () => {

            router.endpoint('get', Controller.middleware);

        });

    });
});

console.log(router.getRoutes());

app.listen(port, (isListening) => {
    console.log(isListening ? `Listening on port ${port}!` : `Error: Could not listen on port ${port}!`)
})