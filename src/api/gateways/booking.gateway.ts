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

import {ok} from "assert";
const options = {
    cors:{
        origin: ['http://localhost:4200', 'https://fysio-performance-front.web.app/bookings'],  // NEW
        credentials: true
    }
}
@WebSocketGateway(options)
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
       /* } then {
        } finally { // ok; */
        
        } catch (e) {
            console.log('GATEWAY ERROR: caught in postSelectedDate');
            // client._error(e.message);  // PROBLEM HERE ??
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
            console.log('newBooking duration: ' + newBooking.duration);
            let addedBookings = await this.bookingService.addBooking(newBooking);
            if (addedBookings == null) {
                console.log('GATEWAY: booking is null: NO new booking emitted');
            } else {
                console.log('GATEWAY: emits booking: ', addedBookings);
                this.server.emit('newBooking', addedBookings);
            }
        } catch (e) {
            console.log('GATEWAY ERROR: caught in postBooking');

            //client._error(e.message);  // PROBLEM HERE ??
        }
    }
    

    @SubscribeMessage('deleteBooking')
    async handleGetDateBookingsEvent(
        @MessageBody() bookingToDeleteDto: BookingDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('GATEWAY: deleteBooking called');
        try {
            const bookingToDelete: BookingModel = JSON.parse(
                JSON.stringify(bookingToDeleteDto),
            );
            const deletedBooking: BookingModel[] = await this.bookingService.deleteBooking(bookingToDelete);
            console.log(deletedBooking.length, ' deletedBooking slots found ');
            this.server.emit('deleteBooking', deletedBooking);
        } catch (e) {
            console.log('GATEWAY ERROR: caught in deleteBooking');
            // client._error(e.message);  // PROBLEM HERE ??
        }
    }

    
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
