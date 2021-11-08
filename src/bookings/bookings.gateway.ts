import {MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import {Socket} from "socket.io";

@WebSocketGateway()
export class BookingsGateway {
    @SubscribeMessage('bookings')
    handleBookingsEvent(@MessageBody() data: string): any {
        console.log(data + ' Hello');
    }



    handleConnect(client: Socket, ...args: any[]): any { // Promise<any> { // DELETABLE METHOD ??
        console.log('Leaderboard Client Connect');
        //client.emit('gameHighscores', this.leaderboardService.getHighScores());
        // this.server.emit('clients', await this.commentService.getClients());
    }

    async handleDisconnect(client: Socket): Promise<any> { // DELETABLE METHOD ??
        console.log('Leaderboard Client Disconnect');
        //  await this.commentService.deleteClient(client.id);
        // this.server.emit('clients', await this.commentService.getClients());
    }
}
