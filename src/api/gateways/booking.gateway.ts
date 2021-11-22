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
        let selectedDateAndDurationModel: dateEnquiryModel = JSON.parse(JSON.stringify(selectedDateAndDuration)); // mock

        let availableTimes = await this.bookingService.getAvailableTimesByDate(selectedDateAndDurationModel);
        console.log('GATEWAY: availableTimes', availableTimes);
        this.server.emit('availableTimes', availableTimes);
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
            let newBooking: BookingModel = JSON.parse(JSON.stringify(newBookingDto));
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
            let addedBooking = await this.bookingService.addBooking(newBooking, newBookingDto.duration);
            if (addedBooking == null) {
                console.log('GATEWAY: booking is null: NO new booking emitted');
            } else {
                console.log('GATEWAY: emits booking: ', addedBooking);
                this.server.emit('newBooking', addedBooking);
            }
        } catch (e) {
            console.log('GATEWAY: emits error:');
            //client._error(e.message);  // PROBLEM HERE
        }
    }


    @SubscribeMessage('deleteBooking')
    async handleDeleteBookingEvent(
        @MessageBody() bookingToDeleteDto: BookingDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        try {
            console.log('bookingToDeleteDto date: ' + bookingToDeleteDto.date);
            console.log('bookingToDeleteDto time: ' + bookingToDeleteDto.time);
            console.log('bookingToDeleteDto email: ' + bookingToDeleteDto.email);
            console.log('bookingToDeleteDto phone: ' + bookingToDeleteDto.phone);
           // console.log(' duration: ' + newBookingDto.duration);
            let bookingToDelete: BookingModel = JSON.parse(JSON.stringify(bookingToDeleteDto));
            console.log('bookingToDelete date: ' + bookingToDelete.date);
            console.log('bookingToDelete time: ' + bookingToDelete.time);
            console.log('bookingToDelete email: ' + bookingToDelete.email);
            console.log('bookingToDelete phone: ' + bookingToDelete.phone);
            let deletedBooking = await this.bookingService.deleteBooking(bookingToDelete);


        } catch (e) {
            console.log('GATEWAY: emits error:');
            //client._error(e.message);  // PROBLEM HERE
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
