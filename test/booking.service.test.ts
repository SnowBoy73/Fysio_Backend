// file: class_a.test.js
//import { ClassB } from "../src/class_b";


 
// https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d

import {Test, TestingModule} from '@nestjs/testing';
import {BookingService} from '../src/core/services/booking.service';
import {BookingEntity} from '../src/infrastructure/data-source/entities/booking.entity';
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {async} from "rxjs";
import {BookingModel} from "../src/core/models/booking.model";

// jest.mock("../src/core/services/booking.service");
// jest.mock("../src/infrastructure/data-source/entities/booking.entity");




// https://medium.com/@jackallcock97/unit-testing-with-nestjs-and-jest-a-comprehensive-tutorial-464910f6c6ba

describe("-- Booking Service --", () => {
    let bookingService: BookingService;
    let module: TestingModule;
    let bookingRepositoryMock: MockType<Repository<BookingEntity>>;
   // let bookingTypeRepositoryMock: MockType<Repository<BookingTypeEntity>>;
    const mockNumberToSatisfyParameters = 0;
// }) //

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                BookingService,
                {provide: getRepositoryToken(BookingEntity), useFactory: repositoryMockFactory},
            ]
        }).compile();

        bookingService = module.get<BookingService>(BookingService);
        bookingRepositoryMock = module.get(getRepositoryToken(BookingEntity));
    });



    /**
     * Checks if the client is active (not deleted and not pending)
     * @param {string} selectedDate
     * @returns {BookingModel[]} isActive
     * was * /
     async getBookingsByDate(bookingId: string): Promise<BookingModel[]> {
    const bookings = await this.findOne(bookingId);
    return bookings !== undefined && booking.date === 0 ? true : false;
    }
     // */


    describe("should populate the booking repository with the following BookingModels", () => {
        const booking = new BookingEntity();
        booking.id =  '1000uuid';
        booking.date = 'Thu Nov 18 2021';
        booking.time = '10:00';
        booking.service = 'Massage';
        booking.email = 'happy@life.com';
        booking.phone = 12345678;
        booking.address = '11 Freedom Ave';
        booking.city = 'Peacetown';
        booking.postcode = 1234;
        booking.notes = '';
        booking.duration = 60;
        
        
        
        it("should return a BookingModel[] of the mock booking on the date: Thu Nov 18 2021", async () => {
            const bookingDate = 'Thu Nov 18 2021';
            bookingRepositoryMock.find.mockReturnValue(booking);
            expect(await bookingService.getBookingsByDate(bookingDate)).toEqual(booking);
        });
        
        it("should return false if client undefined ", async () => {
            const bookingDate2 = 'Fri Nov 19 2021';
            bookingRepositoryMock.find.mockReturnValue(booking);
            let bookingReturns = await bookingService.getBookingsByDate(bookingDate2);
            console.log('bookingReturns = ' + bookingReturns);
            expect(bookingReturns == []);
        });
        
        /*
        it("should return false if client deleted and pending ", async () => {
            const clientId = 1000;
            const booking = new BookingEntity();
            client.clientId = clientId;
            client.deleted = 1;
            client.pending = 1;
            clientRepositoryMock.findOne.mockReturnValue(client);
            expect(await clientService.isActive(clientId)).toEqual(false);
        });
        */
    });


})

    // @ts-ignore
    export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        save: jest.fn()
    }));

    export type MockType<T> = {
        [P in keyof T]: jest.Mock<{}>;
    };




    
    it("should mock getAvailableTimesByDate method in BookingService class", () => {
        const getAvailableTimesByDateMock = jest.fn();
        jest.spyOn(BookingService.prototype, "getAvailableTimesByDate").mockImplementation(getAvailableTimesByDateMock);
    });

    it("should mock findAvailableSlotInWorkPeriod method in BookingService class", () => {
        const findAvailableSlotInWorkPeriod = jest.fn();
        jest.spyOn(BookingService.prototype, "findAvailableSlotInWorkPeriod").mockImplementation(findAvailableSlotInWorkPeriod);
    });
    
    it("should mock getBookingsByDate method in BookingService class", () => {
        const getBookingsByDate = jest.fn();
        jest.spyOn(BookingService.prototype, "getBookingsByDate").mockImplementation(getBookingsByDate);
    });
    
    it("should mock addBooking method in BookingService class", () => {
        const addBooking = jest.fn();
        jest.spyOn(BookingService.prototype, "addBooking").mockImplementation(addBooking);
    });
    
    it("should mock deleteBooking method in BookingService class", () => {
        const deleteBooking = jest.fn();
        jest.spyOn(BookingService.prototype, "deleteBooking").mockImplementation(deleteBooking);
    });
    
    it("should mock getBookingOnDateAndTime method in BookingService class", () => {
        const getBookingOnDateAndTime = jest.fn();
        jest.spyOn(BookingService.prototype, "getBookingOnDateAndTime").mockImplementation(getBookingOnDateAndTime);
    });
    
    it("should mock convertMinutesAfterMidnightToTime method in BookingService class", () => {
        const convertMinutesAfterMidnightToTime = jest.fn();
        jest.spyOn(BookingService.prototype, "convertMinutesAfterMidnightToTime").mockImplementation(convertMinutesAfterMidnightToTime);
    });
    
    it("should mock convertTimeToMinutesAfterMidnight method in BookingService class", () => {
        const convertTimeToMinutesAfterMidnight = jest.fn();
        jest.spyOn(BookingService.prototype, "convertTimeToMinutesAfterMidnight").mockImplementation(convertTimeToMinutesAfterMidnight);
    });
    
    it("should mock convertDateToDbFormat method in BookingService class", () => {
        const convertDateToDbFormat = jest.fn();
        jest.spyOn(BookingService.prototype, "convertDateToDbFormat").mockImplementation(convertDateToDbFormat);
    });
        /*
    
    
    it('should test invalid input', () => {
    const data =  'Tue Nov 16 2021 00:00:00 GMT+0100';
        //let bookingRepository: BookingRepository();
    
        let bookingService: BookingService(bookingRepository);
        const response = bookingService.convertDateToDbFormat(data);
    });
    
    */

    /*
    convertDateToDbFormat(firstName: string, lastName: string) {
        return {
            name: 'Jane Doe',
            grades: [3.7, 3.8, 3.9, 4.0, 3.6],
        };
    }
    */


    /*
    it('should mock async function getAvailableTimesByDate of class BookingService', async () => {
    const bookingService: BookingService = new BookingService();
    jest.spyOn(bookingService, "getAvailableTimesByDate").mockImplementation(async () => "");
    });
    
    it('should mock async function getAvailableTimesByDate of class BookingService', async () => {
    const bookingService2: BookingService;
    const asyncFunctionMock = jest.fn().mockResolvedValue("");
    jest.spyOn(bookingService, "asyncFunction").mockImplementation(asyncFunctionMock);
    });
     */

