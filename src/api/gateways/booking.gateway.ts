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
import { BookingDto } from '../dtos/booking.dto';
import { BookingModel } from '../../core/models/booking.model';
import {dateEnquiryDto} from "../dtos/date-enquiry.dto";
import {dateEnquiryModel} from "../dtos/date-enquiry.model";

@WebSocketGateway()
export class BookingGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(IBookingServiceProvider) private bookingService: IBookingService,
    ) {}
    @WebSocketServer() server;


    @SubscribeMessage('postSelectedDate')
    async handleDateSelectedEvent(
        @MessageBody() selectedDateAndDuration: dateEnquiryDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('GATEWAY: postSelectedDate');
        console.log('selectedDateAndDuration.date = ' +selectedDateAndDuration.date);
        console.log('selectedDateAndDuration.duration = ' +selectedDateAndDuration.duration);
        try {
            let selectedDateAndDurationModel: dateEnquiryModel = JSON.parse(JSON.stringify(selectedDateAndDuration)); // mock
        let availableTimes = await this.bookingService.getAvailableTimesByDate(selectedDateAndDurationModel);
        console.log('GATEWAY: availableTimes', availableTimes);
        this.server.emit('availableTimes', availableTimes);
        } catch (e) {
            console.log('GATEWAY ERROR: caught in postSelectedDate');
            //client._error(e.message);  // PROBLEM HERE
        }
    }
        
        
    @SubscribeMessage('postBooking')
    async handlePostBookingEvent(
        @MessageBody() newBookingDto: BookingDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        // Return CommentModel to controller for REST api
        console.log('newBookingDTO date: ' + newBookingDto.date);
        console.log('newBookingDTO time: ' + newBookingDto.time);
        console.log('newBookingDTO service: ' + newBookingDto.service);
        console.log('newBookingDTO email: ' + newBookingDto.email);
        console.log('newBookingDTO phone: ' + newBookingDto.phone);
        console.log('newBookingDTO address: ' + newBookingDto.address);
        console.log('newBookingDTO city: ' + newBookingDto.city);
        console.log('newBookingDTO postcode: ' + newBookingDto.postcode);
        console.log('newBookingDTO notes: ' + newBookingDto.notes);
        console.log('newBookingDTO duration: ' + newBookingDto.duration);
        try {
            let newBooking: BookingModel = JSON.parse(JSON.stringify(newBookingDto)); // mock
            console.log('newBooking date: ' + newBooking.date);
            console.log('newBooking time: ' + newBooking.time);
            console.log('newBooking service: ' + newBooking.service);
            console.log('newBooking email: ' + newBooking.email);
            console.log('newBooking phone: ' + newBooking.phone);
            console.log('newBooking address: ' + newBooking.address);
            console.log('newBooking city: ' + newBooking.city);
            console.log('newBooking postcode: ' + newBooking.postcode);
            console.log('newBooking notes: ' + newBooking.notes);
            console.log(' duration: ' + newBookingDto.duration);
            let newBooking2 = await this.bookingService.addBooking(newBooking, newBookingDto.duration);
            if (newBooking2 == null) {
                console.log('GATEWAY: booking is null: NO new booking emitted');
            } else {
                console.log('GATEWAY: emits booking: ', newBooking2);

                this.server.emit('newBooking2', newBooking2);
            }
        } catch (e) {
            console.log('GATEWAY ERROR: caught in postBooking');
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
        client.emit('schedule', this.bookingService.getAvailableTimesByDate(null)); // todays date??
        //this.server.emit('clients', await this.bookingService.getClients());
    }

    async handleDisconnect(client: Socket): Promise<any> {
        // await this.commentService.deleteClient(client.id); // Disconnect error is here!!
        //this.server.emit('clients', await this.commentService.getClients());
    }
}
