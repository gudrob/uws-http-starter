# µWebSockets.js HTTP Server Starter Kit

### A starter kit for nodejs projects using the http server of µWebSockets.js

µWebSockets.js offers great performance not only for websockets but http servers aswell.

Because it has its share of pitfalls I have created this fully typed starter kit.
The starter kit has less than 200 Lines of Code but provides you with an alternate router and request approach for µWebSockets.js so you can keep your app structured and use async functions easily.

After npm install you can compile and start the example server using

npm start
    
### Usage

#### Routing

You main app file will probably only include your routes, which will link to the functions defined on your controllers.
The strucure of your router definition could be something like this:

```javascript
    let app: TemplatedApp = uws.App({});
```

Initializes a new App; you can alternatively use uws.SSLApp for https connections.

```javascript
    let router = new Router(app);
```
    
Initializes a new router 
```javascript
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
```
    
Intializes the following routes pointing to the assigned controller functions:

- GET: /async
- POST: /examples/sync
- GET: /examples/async
- GET: /examples/middleware


The first route is only matched by a GET-Request to /async

The second route is only matched by a POST-Request to /group/sync

The third route passes through ExampleMiddleware1 before its handler is called

The fourth route passes through ExampleMiddleware1 and then ExampleMiddleware2 before its handler is called


#### Middleware

The router allows you to define middlewares that can preprocess requests for multiple endpoints.
This way you can for example add an authentication layer with 2 lines of code for all your routes even if you already have hundreds defined.

```javascript
    let Middleware = function (request: RequestData, next: NextFunction): void {
        request.writeStatus("202 Accepted");
        next(request);
    }
```
    
This middleware writes the HTTP status code 202 to our response.
The next parameter specifies which function will be called when the middleware was successfully passed.
Otherwise you could for example end the request.


#### Controllers

```javascript
    export default class Controller {

        public static async(request: RequestData) {
            request.end('Controller.async called');
        }

        public static sync(request: RequestData) {
            request.end('Controller.sync called');
        }

        public static middleware(request: RequestData) {
            request.end('Controller.middleware called');
        }
    }
```

The controller methods are by default designed to be static.
If you require state within your controllers you might want to implement them as singletons.

#### RequestData

The RequestData class is a wrapper around uws' request which is necessary for async functions as uws' request is stack-allocated an therefore stops existing once the base request handler finishes. Accessing the original request after this will cause an error.

It also wraps around uws' response and handles connection termination. The write-methods will return false once the connection is
terminated. You can also use hasEnded() on the RequestData object to check if the connection was terminated. This can be especially useful if you have long running tasks so you can stop their execution on termination.

RequestData contains:

- The requests headers as string
- The method of the request
- The body of the request
- Functions to write to the response


### An example benchmark showing why µWebSockets could be for you

Spawning 4 cluster threads listening on the same socket.

Node Version: v18.14.5

Hardware: Epyc 7702 KVM, 4 dedicated cores, 16 GB RAM, Ubuntu 20.04.4 LTS (GNU/Linux 5.4.0-109-generic x86_64)

Benchmark Command: wrk -t2 -c1000 -d60s http://127.0.0.1:80/

#### Code:

µWebSockets.js:

```javascript
    app.any('/*', (response: HttpResponse, request: HttpRequest) => {
        response.onAborted(()=> {});

        let body = Buffer.from('');
        response.onData(async (data: ArrayBuffer, isLast: boolean) => {
            body = Buffer.concat([body, Buffer.from(data)]);
            
            if (isLast) {
                response.end('Hello world!');
            }
        });
    });
```

Node HTTP:

```javascript
    createServer((request: IncomingMessage, response: ServerResponse) => {
        let body = '';
        request.on('data', (chunk: any) => {
            body += chunk;

            }).on('end', () => {
                response.end('Hello world!');
            });
        });
    });
```
        
#### Average of 10 sequential runs:

##### Node HTTP:
119411.67 requests/sec

##### µWebSockets.JS:
184373.09 requests/sec (54,4% gain)

No errors in all runs

µWebSockets.js is licensed under the Apache License 2.0, please see its LICENSE file for further information.
