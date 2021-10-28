# µWebSockets.js HTTP Server Starter Kit

### A starter kit for nodejs projects using the http server of µWebSockets.js

µWebSockets offers great performance not only for websockets but http servers aswell.

Because it has its share of pitfalls I have created this fully typed starter kit.
The starter kit has less than 200 Lines of Code but provides you with an alternate router and request approach for µWebSockets so you can keep your app structured and use async functions easily.

After a quick npm install you can compile and start the example server using

    npm run go


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
