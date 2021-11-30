import WebSocket from 'ws';
import {startServer, waitForSocketState} from './webSocketTestUtils';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';


const port = 3000;

describe("WebSocket Server", () => {
    // let server;

    beforeAll(async () => {
        // Start server
        server = await startServer(port);
        // console.log('server = ' + server);
    });

    afterAll(() => {
        // Close server
        server.close();
    });

    test("Server echoes the message it receives from client", async () => {
        // 1. Create test client
        const client = new WebSocket(`ws://localhost:${port}`);
        await waitForSocketState(client, client.OPEN);

        const testMessage = "This is a test message";
        let responseMessage;

        client.on("message", (data) => {
            responseMessage = data;
            
            // 3. Close the client after it receives the response
            client.close();
        });

        // 2. Send client message
        client.send(testMessage);
        
        // 4. Perform assertions on the response
        await waitForSocketState(client, client.CLOSED);
        expect(responseMessage).toBe(testMessage);
    });
});