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
import {
    IBookingService,
    IBookingServiceProvider,
} from '../../core/primary-ports/booking.service.interface';
import { ScheduleDTO } from '../dtos/schedule.dto';
import { BookingDTO } from '../dtos/booking.dto';
import { BookingModel } from '../../core/models/booking.model';
import {DateModel} from "../../core/models/date.model";

@WebSocketGateway()
export class BookingGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(IBookingServiceProvider) private bookingService: IBookingService,
    ) {}
    @WebSocketServer() server;



    @SubscribeMessage('bookings')
    handleBookingEvent(@MessageBody() data: string): string {
        console.log('handleBookingEvent' + data);
        return data + 'hello';
    }
    
    
   /* 
    @SubscribeMessage('addBooking')
   // async handlePostBookingEvent(
    async handlePostBookingEvent(

        @MessageBody() bookingDto: BookingDTO,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        // Return CommentModel to controller for REST api
        console.log(
            'booking email: ' +
            bookingDto.email +
            ':  booking date: ' +
            bookingDto.date +
            '  time: ' +
            bookingDto.time,
        );
        try {
            let newBooking: BookingModel = JSON.parse(JSON.stringify(bookingDto));
            newBooking = await this.bookingService.addBooking(newBooking);
            this.server.emit('newBooking', newBooking);
        } catch (e) {
            client._error(e.message);
        }
    }
    
    */
/*
    @SubscribeMessage('requestDateBookings')
    async handleGetDateBookingsEvent(
        @MessageBody() dateDto: DateModel,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('handleGetHighscoreCommentsEvent called');
        try {
            const dateModel: DateModel = JSON.parse(
                JSON.stringify(dateDto ),
            );
            const dateBookings: BookingModel[] = await this.bookingService.getBookingsByDate(dateModel.date);
            console.log(dateBookings.length, ' dateBookings found ');
            this.server.emit('dateBookings', dateBookings);
        } catch (e) {
            client._error(e.message);
        }
    }

    /*
    @SubscribeMessage('login')
    async handleLoginEvent(
        @MessageBody() loginClientDto: loginDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('DTO nickname ', loginCommentClientDto.nickname);
        console.log('handleLoginEvent called');

        // Return Client to controller for REST api
        try {
            let newClient: ClientModel = JSON.parse(
                JSON.stringify(loginCommentClientDto),
            );
            console.log('newClient ', newClient);
            newClient = await this.commentService.addClient(newClient);
            console.log('newClient2 ', newClient);
            const clients = await this.commentService.getClients();
            console.log('clients ', clients);
            const welcome: WelcomeDto = {
                clients: clients,
                client: newClient,
                comments: null, // should remove from welcomeDto?
            };
            console.log('welcomeDto ', welcome);
            console.log('All nicknames ', clients);
            client.emit('welcome', welcome);
            this.server.emit('clients', clients);
        } catch (e) {
            client.error(e.message);
        }
    }

    @SubscribeMessage('logout')
    async handleLogoutEvent(
        @MessageBody() loggedInUserId: string,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('comment Gate logout id: ', loggedInUserId);

        // Return Client to controller for REST api
        try {
            await this.commentService.deleteClient(loggedInUserId);
        } catch (e) {
            client.error(e.message);
        }
    }
*/
    async handleConnection(client: Socket, ...args: any[]): Promise<any> {
        console.log('Client Connect', client.id);
        client.emit('schedule', this.bookingService.getBookingsByDate(null)); // todays date??
        //this.server.emit('clients', await this.bookingService.getClients());
    }

    async handleDisconnect(client: Socket): Promise<any> {
        // await this.commentService.deleteClient(client.id); // Disconnect error is here!!
        //this.server.emit('clients', await this.commentService.getClients());
    }
}
