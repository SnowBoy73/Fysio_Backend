import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IBookingService } from '../../core/primary-ports/booking.service.interface';
import { BookingDTO } from '../dtos/booking.dto';
import { DateModel } from "../../core/models/date.model";
export declare class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private bookingService;
    constructor(bookingService: IBookingService);
    server: any;
    handlePostBookingEvent(bookingDto: BookingDTO, client: Socket): Promise<void>;
    handleGetDateBookingsEvent(dateDto: DateModel, client: Socket): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<any>;
    handleDisconnect(client: Socket): Promise<any>;
}
