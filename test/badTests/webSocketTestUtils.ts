import createWebSocketServer from './createWebSocketServer';
import * as http from 'http';

function startServer(port) {
    const server = http.createServer();
    createWebSocketServer(server);

    return new Promise((resolve) => {
        server.listen(port, () => resolve(server));
    });
}


function waitForSocketState(socket, state) {
    return new Promise<void>(function (resolve) {
        setTimeout(function () {
            if (socket.readyState === state) {
                resolve();
            } else {
                waitForSocketState(socket, state).then(resolve);
            }
        }, 5);
    });
}

export { startServer, waitForSocketState };
