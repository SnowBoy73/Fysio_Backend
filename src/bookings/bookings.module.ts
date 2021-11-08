import { Module } from '@nestjs/common';
import {BookingsGateway} from './bookings.gateway';

@Module({
    providers: [BookingsGateway],
})
export class BookingsModule {}
