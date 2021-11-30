import { Test } from '@nestjs/testing';
//import { CatsController } from './cats.controller';
import { BookingGateway } from '../src/api/gateways/booking.gateway';
import { BookingService } from '../src/core/services/booking.service';
import {ConnectedSocket, MessageBody} from "@nestjs/websockets";
import {dateEnquiryDto} from "../src/api/dtos/date-enquiry.dto";
import {Socket} from "socket.io";

describe('BookingTest', () => {
    //let catsController: CatsController;
    let bookingGateway: BookingGateway;
    let bookingService: BookingService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            //controllers: [CatsController],
            //gateway: [BookingGateway],
            controllers: [BookingGateway],
            providers: [BookingService],
        }).compile();

        bookingService = await moduleRef.resolve(BookingService);

        
        bookingGateway = moduleRef.get<BookingGateway>(BookingGateway);
        bookingService = moduleRef.get<BookingService>(BookingService);
        //catsController = moduleRef.get<CatsController>(CatsController);
    });

    describe('getAvailableTimesByDate',  () => {
        it('should return an array of strings', async () => {
            const result = ['test'];
            //jest.spyOn(bookingService, 'getAvailableTimesByDate').mockResolvedValue(result)
     //       jest.spyOn(bookingService, 'getAvailableTimesByDate').mockImplementation(() => result);

            //expect(bookingGateway.handleDateSelectedEvent()).resolves.toEqual(result)
      //      expect(await bookingGateway.handleDateSelectedEvent({date, duration},client)).toBe(result);
        });
    });
});

/*
 describe('getAvailableTimesByDate',  () => {
        it('should return an array of strings', async () => {
            const result: Promise<any> = ['test'];
            jest.spyOn(bookingService, 'getAvailableTimesByDate').mockImplementation(() => result);

            expect(await bookingGateway.handleDateSelectedEvent( selectedDateAndDuration,
             client)).toBe(result);
        });
    });
});
 */

