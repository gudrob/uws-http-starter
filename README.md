# µWebSockets.js HTTP Server Starter Kit

### A basis for nodejs projects using the http server of µWebSockets.js

µWebSockets offers great performance not only for websockets but http servers aswell.

Because it has its share of pitfalls I have created this fully typed starter kit. Originally made for myself but I'm sure someone can make use of it.

The starter kit has less than 200 Lines of Code but provides you with an alternate router and request approach for µWebSockets so you can keep your app structured and can use NodeJS in all its async glory.

µWebSockets binaries for windows, linux (arm/x64) and macOS are already included.

After a quick npm install you can start the example server using

    npm run go

### An example benchmark on why µWebSockets could be for you

Spawning 6 cluster threads listening on the same socket.

Node Version: v12.22.3

Hardware: MacBook Pro (15", 2019), 2,6 GHz 6‑Core Intel Core i7

Benchmark Command: wrk -t2 -c1000 -d60s http://127.0.0.1:80/

#### Code:

µWebSockets.JS:

    this.app.any(path, (response: HttpResponse, request: HttpRequest) => {
        let body = '';
        res.onData(async (data: ArrayBuffer, isLast: boolean) => {
            body += data;
            
            if (isLast) {
                response.end('Hello world!');
            }
        });
    });
            
Node HTTP:

    http.createServer((request: IncomingMessage, response: ServerResponse) => {
        let body = '';
        request.on('data', (chunk: any) => {
            body += chunk;

            }).on('end', () => {
                response.end('Hello world!');
            });
        });
    });
        

#### Average of 10 runs with 2 minutes of cooldown time in between:

##### Node HTTP:
79,323.3 requests/sec

##### µWebSockets.JS:
167,921.4 requests/sec

µWebSockets.JS is licensed under the Apache License 2.0, please see its LICENSE file for further information.
