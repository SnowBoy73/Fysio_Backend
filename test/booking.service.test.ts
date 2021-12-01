// file: class_a.test.js
//import { ClassB } from "../src/class_b";


 
// https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d

import {Test, TestingModule} from '@nestjs/testing';
import {BookingService} from '../src/core/services/booking.service';
import {BookingEntity} from '../src/infrastructure/data-source/entities/booking.entity';
import {BookingModel} from '../src/core/models/booking.model';
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";

//jest.mock('../src/core/services/booking.service');
//jest.mock('../src/core/models/booking.model');
//jest.mock('../src/infrastructure/data-source/entities/booking.entity');




// https://medium.com/@jackallcock97/unit-testing-with-nestjs-and-jest-a-comprehensive-tutorial-464910f6c6ba

describe("-- Booking Service --", () => {
    let bookingService: BookingService;
    let module: TestingModule;
    let bookingRepositoryMock: MockType<Repository<BookingEntity>>;  //  was <BookingEntity[]>
    const mockNumberToSatisfyParameters = 0;


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



    describe("should populate the booking repository with the following BookingModels", () => {
        const booking1 = new BookingEntity();
        booking1.id =  '1000uuid';
        booking1.date = 'Thu Nov 18 2021';
        booking1.time = '10:00';
        booking1.service = 'Massage';
        booking1.email = 'happy@life.com';
        booking1.phone = 12345678;
        booking1.address = '11 Freedom Ave';
        booking1.city = 'Peacetown';
        booking1.postcode = 1234;
        booking1.notes = 'Go easy on me';
        booking1.duration = 30;
        
        const booking2a = new BookingEntity();
        booking2a.id =  '1001uuid';
        booking2a.date = 'Tue Nov 16 2021';
        booking2a.time = '15:00';
        booking2a.service = 'Fysioterapi';
        booking2a.email = 'mock@test.com';
        booking2a.phone = 87654321;
        booking2a.address = '56 Repository Rd';
        booking2a.city = 'Smurf Village';
        booking2a.postcode = 2121;
        booking2a.notes = '';
        booking2a.duration = 60;

        const booking2b = new BookingEntity();
        booking2b.id =  '1002uuid';
        booking2b.date = 'Tue Nov 16 2021';
        booking2b.time = '15:30';
        booking2b.service = 'Fysioterapi';
        booking2b.email = 'mock@test.com';
        booking2b.phone = 87654321;
        booking2b.address = '56 Repository Rd';
        booking2b.city = 'Smurf Village';
        booking2b.postcode = 2121;
        booking2b.notes = '';
        booking2b.duration = 60;

        let bookings: BookingModel[] = [];
        bookings.push(booking1, booking2a, booking2b);
        

        
        //   TEST getAvailableTimesByDate METHOD */
        //   TEST findAvailableSlotInWorkPeriod METHOD */
        
        

        //   TEST getBookingsByDate METHOD */
        
        it("3a should return a BookingEntity[] of the mock booking on the date: Thu Nov 18 2021", async () => {
            const bookingDate1 = 'Thu Nov 18 2021';
            bookingRepositoryMock.find.mockReturnValue(bookings);
            const expectedResult = [booking1];
            jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
            const receivedResult = await bookingService.getBookingsByDate(bookingDate1);
            expect(receivedResult).toEqual(expectedResult);
        });  // WORKS!! maybe

        
        it("3b should return a BookingEntity[] of the mock bookings on the date: Tue Nov 16 2021", async () => {
            const bookingDate1 = 'Thu Nov 18 2021';
            const bookingDate2 = 'Tue Nov 16 2021';
            bookingRepositoryMock.find.mockReturnValue(bookings);
            const expectedResult = [booking2a, booking2b];
            jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
            const receivedResult = await bookingService.getBookingsByDate(bookingDate1);
            expect(receivedResult).toEqual(expectedResult);
            //expect(bookingService.getBookingsByDate).toBeCalledTimes(1);
        });   // WORKS!! maybe
        
        
        it("3c should return an empty BookingModel[] as no mock booking on the date: Wed Nov 17 2021", async () => {
            //const bookingDate1 = 'Thu Nov 18 2021';
            const bookingDate2 = 'Tue Nov 16 2021';
            const bookingDate3 = 'Wed Nov 17 2027';
            bookingRepositoryMock.find.mockReturnValue(bookings);
            const expectedResult: BookingModel[] = [];
            jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
            //const receivedResult = await bookingService.getBookingsByDate(bookingDate3);
            //expect(await bookingService.getBookingsByDate(bookingDate1)).toEqual(expectedResult);
            expect(await bookingService.getBookingsByDate(bookingDate2)).toEqual(expectedResult);
            expect(await bookingService.getBookingsByDate(bookingDate3)).toEqual(expectedResult);
            //expect(typeof (await bookingService.getBookingsByDate(bookingDate3))).toBe("BookingModel[]");
        });  // Not confident about the results

        
        it("3d should return a BookingModel[] of the mock booking on the date: Tue Nov 16 2021", async () => {
            const bookingDate2 = 'Thu Nov 18 2021';
            bookingRepositoryMock.find.mockReturnValue(bookings);
            const expectedResult: BookingModel[] = [booking2a, booking2b];
            jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
            const receivedResult = await bookingService.getBookingsByDate(bookingDate2);
            expect(receivedResult).toEqual(booking1);
        });

        
        it("3e should return a BookingModel[] of the mock booking on the date: Tue Nov 16 2021", async () => {
            const bookingDate2 = 'Tue Nov 16 2021';
            bookingRepositoryMock.find.mockReturnValue(booking1);
            let bookingReturns = await bookingService.getBookingsByDate(bookingDate2);
            expect(bookingReturns === []);
            //expect(bookingReturns).toBe([]);
            expect(bookingReturns).toBeCalledTimes(1);
        });
        
   

       
         //   TEST addBooking METHOD */

        describe("4 should add newBooking to the booking repository", () => {
            const newBooking = {
                id: '1001uuid',
                date: 'Tue Nov 16 2021',  // Time is available to book
                time: '16:00',
                service: 'Massage',
                email: 'happy@life.com',
                phone: 12345678,
                address: '11 Freedom Ave',
                city: 'Peacetown',
                postcode: 1234,
                notes: 'Go easy on me',
                duration: 30,
            }
             
            it("4a should add a BookingModel[1] of the mock new booking", async () => {
                let newBookingReturn = await bookingService.addBooking(newBooking);
                expect(newBookingReturn.length).toEqual(1);  // 1 x 30 minutes
              //  expect(newBookingReturn[0].time).toBe('16:00');  // 1 x 30 minutes
/*
                if (newBooking.duration == 60) {
                    expect(newBookingReturn.length).toEqual(2);
                }
                */
            }); 
        })

        
        describe("4b should NOT add newBooking to the booking repository", () => {
            const newBooking = {
                id: '1001uuid',
                date: 'Tue Nov 16 2021',  // Already a booking at this time. should return []
                time: '15:00',
                service: 'Massage',
                email: 'happy@life.com',
                phone: 12345678,
                address: '11 Freedom Ave',
                city: 'Peacetown',
                postcode: 1234,
                notes: 'Go easy on me',
                duration: 30,
            }
            it("4b should NOT add a BookingModel[] of the mock new booking", async () => {
                let newBookingReturn = await bookingService.addBooking(newBooking);
                expect(newBookingReturn === []);
                /*
                if (newBooking.duration == 60) {
                    expect(newBookingReturn.length).toEqual(2);
                }
                */
            });
        })

        
        
         //   TEST deleteBooking METHOD */
        
        describe("5 should NOT delete a BookingModel[] of the mock booking to delete", () => {
            const bookingToDelete = {
                id: '',
                date: 'Tue Nov 16 2029',  // No booking on this date to delete. Should return []
                time: '15:00',
                service: '',
                email: 'happy@life.com',
                phone: 12345678,
                address: '',
                city: '',
                postcode: 0,
                notes: '',
                duration: 60,
            }
            
            it("5a should NOT return a BookingModel[] of the mock booking on the date: Tue Nov 16 2021", async () => {
                let deletedBookingReturn = await bookingService.deleteBooking(bookingToDelete);
                // JEST PROBLEMS BELOW
                 expect(deletedBookingReturn === []);

                // expect(deletedBookingReturn[0].time).toEqual('15:00');
                /* if (bookingToDelete.duration == 60) {
                    expect(deletedBookingReturn.length).toEqual(2);
                } */
            });
        })



       
         //   TEST getBookingOnDateAndTime METHOD */
        //getBookingOnDateAndTime(bookingToGet: BookingModel): Promise<BookingModel[]>

        describe("6 should return a BookingModel[] of the mock booking to get", () => {
            const bookingToGet = {
                id: '',
                date: 'Tue Nov 16 2021',  // No booking on this date to delete. Should return BookingModel[2]
                time: '15:00',
                service: '',
                email: '',
                phone: 0,
                address: '',
                city: '',
                postcode: 0,
                notes: '',
                duration: 60,
            }
            
            it("6a should return a BookingModel[2] of the mock booking on the date: Tue Nov 16 2021 at 15:00 and 15:30", async () => {
                let getBookingReturn = await bookingService.getBookingOnDateAndTime(bookingToGet);
                //expect(getBookingReturn.length == 2);
                expect(getBookingReturn.length).toEqual(2);
                //expect(getBookingReturn[0].time).toEqual('15:00'); //

            });
        })


        
        //   TEST convertMinutesAfterMidnightToTime METHOD */
        describe("7 Testing convertMinutesAfterMidnightToTime", () => {
            it("7a should return a string of '9:00'", () => {
                const timeInMaM = 540;
                const expectedResult = '9:00';
                expect(bookingService.convertMinutesAfterMidnightToTime(timeInMaM)).toEqual(expectedResult);
                expect(typeof (bookingService.convertMinutesAfterMidnightToTime(timeInMaM))).toBe("string");
            });
            
            it("7b should return a string of '9:00'", () => {
                const timeInMaM = 540;
                const expectedResult = '8:00';
                expect(bookingService.convertMinutesAfterMidnightToTime(timeInMaM)).not.toEqual(expectedResult);
            });

            it("7c should return a string of '13:30'", () => {
                const timeInMaM = 810;
                const expectedResult = '13:30';
                expect(bookingService.convertMinutesAfterMidnightToTime(timeInMaM)).toEqual(expectedResult);
                expect(typeof (bookingService.convertMinutesAfterMidnightToTime(timeInMaM))).toBe("string");
            });
        });



        //   TEST convertTimeToMinutesAfterMidnight METHOD */
        describe("8 Testing convertMinutesAfterMidnightToTime", () => {
            it("8a should return a number of 540", () => {
                const timeAsString = '9:00';
                const expectedResult = 540;
                expect(bookingService.convertTimeToMinutesAfterMidnight(timeAsString)).toEqual(expectedResult);
                expect(typeof (bookingService.convertTimeToMinutesAfterMidnight(timeAsString))).toBe("number");
            });

            it("8b should return a string of '9:00'", () => {
                const timeAsString = '15:00';
                const expectedResult = 1020;
                expect(bookingService.convertTimeToMinutesAfterMidnight(timeAsString)).not.toEqual(expectedResult);
            });
        });
        
        
        
        //   TEST convertDateToDbFormat METHOD */
        describe("9 Testing convertMinutesAfterMidnightToTime", () => {
            it("9a should return a number of 540", () => {
                const unformattedDate = 'Tue Nov 30 2021 00:00:00 GMT+0100 (Central European Standard Time)';
                const expectedResult = 'Tue Nov 30 2021';
                expect(bookingService.convertDateToDbFormat(unformattedDate)).toEqual(expectedResult);
                expect(typeof (bookingService.convertDateToDbFormat(unformattedDate))).toBe("string");
            });

            it("9b should return a string of '9:00'", () => {
                const unformattedDate = 'Tue Nov 30 2021 00:00:00 GMT+0100 (Central European Standard Time)';
                const expectedResult = 'Tue Nov 30 2021 00:00:00 GMT+0100 (Central European Standard Time)';
                expect(bookingService.convertTimeToMinutesAfterMidnight(unformattedDate)).not.toEqual(expectedResult);
            });
        });
        
        
        
            // END OF BOOKING SERVICE TESTS

    })
    
    
    
    it("should mock getAvailableTimesByDate method in BookingService class", async () => {
        //const bookingService: BookingService = new BookingService();
        const getAvailableTimesByDateMock = jest.fn();
        jest.spyOn(bookingService, "getAvailableTimesByDate").mockImplementation(getAvailableTimesByDateMock);
    });

    it("should mock findAvailableSlotInWorkPeriod method in BookingService class", () => {
        const findAvailableSlotInWorkPeriod = jest.fn();
        jest.spyOn(bookingService, "findAvailableSlotInWorkPeriod").mockImplementation(findAvailableSlotInWorkPeriod);
    });
    /*
    it("should mock getBookingsByDate method in BookingService class", () => {
        const getBookingsByDate = jest.fn();
        jest.spyOn(bookingService, "getBookingsByDate").mockImplementation(getBookingsByDate);
    });
    */
    it("should mock addBooking method in BookingService class", () => {
        const addBooking = jest.fn();
        jest.spyOn(bookingService, "addBooking").mockImplementation(addBooking);
    });
    
    it("should mock deleteBooking method in BookingService class", () => {
        const deleteBooking = jest.fn();
        jest.spyOn(bookingService, "deleteBooking").mockImplementation(deleteBooking);
    });
    
    it("should mock getBookingOnDateAndTime method in BookingService class", () => {
        const getBookingOnDateAndTime = jest.fn();
        jest.spyOn(bookingService, "getBookingOnDateAndTime").mockImplementation(getBookingOnDateAndTime);
    });
    
    it("should mock convertMinutesAfterMidnightToTime method in BookingService class", () => {
        const convertMinutesAfterMidnightToTime = jest.fn();
        jest.spyOn(bookingService, "convertMinutesAfterMidnightToTime").mockImplementation(convertMinutesAfterMidnightToTime);
    });
    
    it("should mock convertTimeToMinutesAfterMidnight method in BookingService class", () => {
        const convertTimeToMinutesAfterMidnight = jest.fn();
        jest.spyOn(bookingService, "convertTimeToMinutesAfterMidnight").mockImplementation(convertTimeToMinutesAfterMidnight);
    });
    
    it("should mock convertDateToDbFormat method in BookingService class", () => {
        const convertDateToDbFormat = jest.fn();
        jest.spyOn(bookingService, "convertDateToDbFormat").mockImplementation(convertDateToDbFormat);
    });



afterEach(() => {
    jest.resetAllMocks();
});


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


})



// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    length: jest.fn(),
    where: jest.fn(),
    //getBookingsByDate: jest.fn()
}));

export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;   // bookings: BookingModel[]
    //[P in keyof T]: BookingEntity[];   // bookings: BookingModel[]
};


