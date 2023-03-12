import Controller from "./controllers/Controller";
import { ExampleMiddleware1 } from "./middleware/ExampleMiddleware1";
import { ExampleMiddleware2 } from "./middleware/ExampleMiddleware2";
import { Router } from "uws-router";

let router = new Router(false, {
    //Use SSLApp and add your SSL config here if needed
    //See the μWebSockets.js docs for more info
    //cert_file_name: 'server.cert',
    //key_file_name: 'server.key'
});

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

router.listen("127.0.0.1", port, (isListening) => {
    console.log(isListening ? `Listening on port ${port}!` : `Error: Could not listen on port ${port}!`)
})