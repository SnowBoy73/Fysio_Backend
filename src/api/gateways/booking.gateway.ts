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
import { BookingDto } from '../dtos/bookingDto';
import { BookingModel } from '../../core/models/booking.model';

@WebSocketGateway()
export class BookingGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(IBookingServiceProvider) private bookingService: IBookingService,
    ) {}
    @WebSocketServer() server;
    
    @SubscribeMessage('postBooking')
    async handlePostBookingEvent(
        @MessageBody() newBookingPeriods: BookingDto[],
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        // Return CommentModel to controller for REST api
        console.log(
            'bookingDTO email: ' +
            newBookingPeriods[0].email +
            ':  bookingDTO date: ' +
            newBookingPeriods[0].date +
            '  timeDTO: ' +
            newBookingPeriods[0].time,
        );
        try {
            let newBooking: BookingModel[] = JSON.parse(JSON.stringify(newBookingPeriods[0])); // mock
            let newBooking2 = await this.bookingService.addBooking(newBooking);
   //     
            if (newBooking2 == null) {
                console.log('GATEWAY: booking is null: NO new booking emitted');


            } else {
                console.log('GATEWAY: emits booking: ', newBooking2);

                this.server.emit('newBooking2', newBooking2);
            }
        } catch (e) {
            //client._error(e.message);  // PROBLEM HERE
        }
    }
    
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
