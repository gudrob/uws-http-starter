# µWebSockets.js HTTP Server Starter Kit

### A starter kit for nodejs projects using the http server of µWebSockets.js

µWebSockets offers great performance not only for websockets but http servers aswell.

Because it has its share of pitfalls I have created this fully typed starter kit.
The starter kit has less than 200 Lines of Code but provides you with an alternate router and request approach for µWebSockets so you can keep your app structured and use async functions easily.

After a quick npm install you can compile and start the example server using

    npm run go
    
    
### Usage

#### Routing

You main app file will probably only include your routes, which will link to the functions defined on your controllers.
The strucure of your router definition could be something like this:

    let app: TemplatedApp = uws.App({});

Initializes a new App; you can alternatively use uws.SSLApp for https connections.

    let router = new Router(app);
    
Initializes a new router 

    router.endpoint('get', Controller.async);
    
    router.group('group', () => {

    router.endpoint('post', Controller.sync);

        router.middleware(ExampleMiddleware1, () => {

            router.endpoint('get', Controller.async);

            router.middleware(ExampleMiddleware2, () => {

                router.endpoint('get', Controller.middleware);

            });

        });
    });
    
Intializes the following routes pointing to the assigned controller functions:

GET: /async

POST: /group/sync

GET: /group/async

GET: /group/middleware


The first route is only matched by a GET-Request to /async

The sround route is only matched by a POST-Request to /group/sync

The third route passes through ExampleMiddleware1 before its handler is called

The fourth route passes through ExampleMiddleware1 and then ExampleMiddleware2 before its handler is called


#### Middleware

The router allows you to define middlewares that can preprocess requests for multiple endpoints.
This way you can for example add an authentication layer with 2 lines of code for all your routes even if you already have hundreds defined.

    let Middleware = function (request: RequestData, response: HttpResponse, next: NextFunction): void {
        response.writeStatus("202 Accepted");
        next(request, response, next);
    }
    
This middleware writes the HTTP status code 202 to our response.
The next parameter specifies which function will be called when the middleware was successfully passed.
Otherwise you could for example end the request.


#### Controllers

    export default class Controller {

        public static async(req: RequestData, response: HttpResponse) {
            response.end('middleware called');
        }

        public static sync(req: RequestData, response: HttpResponse) {
            response.end('middleware called');
        }

        public static middleware(req: RequestData, response: HttpResponse) {
            response.end('middleware called');
        }
    }

The controller methods are by default designed to be static.
If you require state within your controllers you might want to implement them as singletons.


#### RequestData

The RequestData class is a wrapper around uws Request which is necessary for async functions as uws' request is stack-allocated an therefore stops existing once the base request handler finishes. Accessing the original request after this will cause an error.
RequestData contains:

- The requests headers as string
- The method of the request
- The body of the request


### An example benchmark showing why µWebSockets could be for you

Spawning 4 cluster threads listening on the same socket.

Node Version: v16.5.0

Hardware: Epyc 7702 KVM, 4 dedicated cores, 16 GB RAM, Ubuntu 20.04.1 LTS (GNU/Linux 5.4.0-58-generic x86_64)

Benchmark Command: wrk -t2 -c1000 -d60s http://127.0.0.1:80/

#### Code:

µWebSockets.JS:

    app.any('/*', (response: HttpResponse, request: HttpRequest) => {
        let body = '';
        
        response.onAborted(()=> {});
        
        response.onData(async (data: ArrayBuffer, isLast: boolean) => {
            body += data;
            
            if (isLast) {
                response.end('Hello world!');
            }
        });
    });
            
Node HTTP:

    createServer((request: IncomingMessage, response: ServerResponse) => {
        let body = '';
        request.on('data', (chunk: any) => {
            body += chunk;

            }).on('end', () => {
                response.end('Hello world!');
            });
        });
    });
        

#### Average of 10 sequential runs:

##### Node HTTP:
116323.61 requests/sec

##### µWebSockets.JS:
 165690.66 requests/sec (42,5% gain)

No errors in all runs

µWebSockets.JS is licensed under the Apache License 2.0, please see its LICENSE file for further information.
