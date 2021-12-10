import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import {ServicesDto} from "../dtos/services.dto";
import {IServicesService, IServicesServiceProvider} from "../../core/primary-ports/services.service.interface";
const options = {
    cors:{
        origin: ['http://localhost:4200', 'https://fysio-performance-front.web.app/bookings'],  // NEW
        credentials: true
    }
}
@WebSocketGateway(options)
export class ServicesGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(IServicesServiceProvider) private sharedService: IServicesService,
    ) {}
    
    @WebSocketServer() server;

    @SubscribeMessage('getAllServices')
    async handleGetServicesEvent(
        //@MessageBody() //selectedDateAndDuration: dateEnquiryDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('SHARED GATEWAY: getServices');
        try {
            let allServices = await this.sharedService.getAllServices();
            this.server.emit('allServices', allServices);
            /* } then {
             } finally { // ok; */

        } catch (e) {
            console.log('SHARED ERROR: caught in postSelectedDate');
            // client._error(e.message);  // PROBLEM HERE ??
        }
    }

    handleConnection(client: any, ...args: any[]) {
        // Could emit allServices on Connect
        //throw new Error('Method not implemented.');
    }

    async handleDisconnect(client: Socket): Promise<any> {
        // await this.commentService.deleteClient(client.id); // Disconnect error is here!!
        //this.server.emit('clients', await this.commentService.getClients());
    }

}