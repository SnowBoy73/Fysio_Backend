import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Query} from '@nestjs/common';
import { IBookingService, IBookingServiceProvider } from 'src/core/primary-ports/booking.service.interface';

@Controller('schedule')
export class ScheduleController {
    constructor(
        @Inject(IBookingServiceProvider)
        private bookingService: IBookingService,
    ) {}

    @Get()
    async get(@Body() date: string) {  // was index ??
        return await this.bookingService.getBookingsByDate(date);
    }
    
}
