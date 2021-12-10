import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookingEntity} from "../infrastructure/data-source/entities/booking.entity";
import {BookingGateway} from "./gateways/booking.gateway";
import {BookingService} from "../core/services/booking.service";
import {IBookingServiceProvider} from "../core/primary-ports/booking.service.interface";
import {TimetableEntity} from "../infrastructure/data-source/entities/timetable.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([BookingEntity, TimetableEntity]),
    ],
    providers: [
        BookingGateway,
        {
            provide: IBookingServiceProvider,
            useClass: BookingService,
        },
    ],
})
export class BookingModule {}
