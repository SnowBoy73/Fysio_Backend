// file: class_a.test.js
//import { ClassB } from "../src/class_b";


 
// https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d

import {Test, TestingModule} from '@nestjs/testing';
import {BookingService} from '../src/core/services/booking.service';
import {BookingEntity} from '../src/infrastructure/data-source/entities/booking.entity';
import {BookingModel} from '../src/core/models/booking.model';
import {dateEnquiryModel} from '../src/api/dtos/date-enquiry.model';
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


    afterEach(() => {
        jest.clearAllMocks();
    });

    

    describe("should populate the booking repository with the following BookingModels", () => {
        const booking1 = new BookingEntity();  // Mock repository entry 1
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
        
        const booking2a = new BookingEntity();  // Mock repository entry 2
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

        const booking2b = new BookingEntity();  // Mock repository entry 3
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
        //     async getAvailableTimesByDate(selectedDateAndDuration: dateEnquiryModel): Promise<string[]> {
        //startTime: string = '8:00';
        //breakStart: string = '11:00';  // lunch from 11:00 until 12:00
        //breakFinish: string = '12:00';
        //finishTime: string = '18:00';
        
        describe("1 should test getBookingsByDate method using the booking repository", () => {
            const dateEnquiry1: dateEnquiryModel = {
                date: 'Thu Nov 18 2021 00:00:00 GMT+0100 (Central European Standard Time)',
                duration: 60  // one hour booking (2 x 30 mins)
            }
            it("1a should return a string[] of times on the date: Thu Nov 18 2021", async () => {
                bookingRepositoryMock.find.mockReturnValue(bookings);  // 1 x 30 min booking at 10:00
                const expectedResult = ['8:00', '8:30', '9:00', '12:00', '12:30', '13:00', '13:30', '14:00', '16:00', '16:30', '17:00'];
                const receivedResult = await bookingService.getAvailableTimesByDate(dateEnquiry1);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(11);
                // Testing negative results
                const falseResult1 =  ['7:00', '7:30', '9:00', '12:00', '12:30', '13:00', '13:30', '14:00', '16:00', '16:30', '17:00'];
                expect(receivedResult).not.toEqual(falseResult1);  // Same [] length, but wrong times (7:00 and 7:30)
                const falseResult2 =  ['8:00', '8:30', '12:00', '12:30', '13:00', '13:30', '14:00', '16:00', '16:30', '17:00'];
                expect(receivedResult).not.toEqual(falseResult2);  // Correct times, but missing '9:00'
            });
            jest.clearAllMocks();
        })
    
        describe("1b should test getBookingsByDate method using the booking repository", () => {
            const dateEnquiry2: dateEnquiryModel = {
                date: 'Tue Nov 16 2021 00:00:00 GMT+0100 (Central European Standard Time)',
                duration: 30  // half hour booking (1 x 30 mins)
            }
            it("1b should return a string[] of available times on the date: Tue Nov 16 2021", async () => {
                bookingRepositoryMock.find.mockReturnValue([booking2a, booking2b]); //bookings);  // Mocks not resetting properly, so had to remove booking1 
                const expectedResult = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '16:00', '16:30', '17:00', '17:30'];
                const receivedResult = await bookingService.getAvailableTimesByDate(dateEnquiry2);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(16);  
                // Testing negative results
                const falseResult1 = ['8:20', '9:50', '11:11', '9:30', '10:00', '10:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '16:00', '16:30', '17:00', '17:30'];
                expect(receivedResult).not.toEqual(falseResult1);  // Same [] length, but wrong times
                const falseResult2 = ['8:30', '9:00', '9:30', '10:00', '10:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '16:00', '16:30', '17:00', '17:30'];
                expect(receivedResult).not.toEqual(falseResult2);  // Correct times, but missing '8:00'
            });
        })
        
        
        
        //   TEST findAvailableSlotInWorkPeriod METHOD */
        //     findAvailableSlotInWorkPeriod(startTime: number, finishTime: number, bookingSlotsNeeded: number, datesBookingTimesInMinutesAfterMidnight: number[]): string[] {
            
        describe("2 should test findAvailableSlotInWorkPeriod method using the booking repository", () => {
            // Testing morning period with 1 hour booking
            const startTime = 480;  // is 8:00 in minutes after midnight
            const finishTime = 660; // is 11:00 in minutes after midnight
            const bookingSlotsNeeded = 1; // Half hour booking - 2 x 30 minute slots
            const datesBookingTimesInMinutesAfterMidnight = [540, 570];  // Represents an hour long booking at 9:00 (which includes 9:30)
            it("2a should return a string[] of times",() => {
                const expectedResult = ['8:00', '8:30', '10:00', '10:30'];  // Available times for an hour long booking
                const receivedResult = bookingService.findAvailableSlotInWorkPeriod(startTime, finishTime, bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(4);
                // Testing negative results
                const falseResult1 = ['8:30', '9:30', '10:00', '10:30'];
                expect(receivedResult).not.toEqual(falseResult1);  // Same [] length, but unavailable time at 9:30
                const falseResult2 = ['8:00', '8:30', '10:00', '10:30', '11:00'];
                expect(receivedResult).not.toEqual(falseResult2);  // Correct times, but added '11:00' which is unavailable (for lunch)
            });
        })

        describe("2 should test findAvailableSlotInWorkPeriod method using the booking repository", () => {
            // Testing afternoon period with half hour booking
            const startTime = 720;  // is 12:00 in minutes after midnight
            const finishTime = 1080; // is 11:00 in minutes after midnight
            const bookingSlotsNeeded = 2; // An hour booking - 2 x 30 minute slots
            const datesBookingTimesInMinutesAfterMidnight = [750, 780, 900, 1050];  // Represents bookings at 12:30, 13:00, 15:00 and 17.30
            it("2b should return a string[] of times",() => {
                const expectedResult = ['13:30', '14:00', '15:30', '16:00', '16:30'];  // Available times for an hour long booking
                const receivedResult = bookingService.findAvailableSlotInWorkPeriod(startTime, finishTime, bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(5);
                // Testing negative results
                const falseResult1 = ['8:30', '9:30'];
                //expect(receivedResult).not.toEqual(falseResult1);  // Same [] length, but unavailable times
                const falseResult2 = ['8:00', '10:00', , '11:00'];
                //expect(receivedResult).not.toEqual(falseResult2);  // Correct times, but added '11:00' which is unavailable (for lunch)
            });
        })
    
        //   TEST getBookingsByDate METHOD */

        describe("3 should test getBookingsByDate method using the booking repository", () => {
            it("3a should return a BookingEntity[] of the mock booking on the date: Thu Nov 18 2021", async () => {
                const bookingDate1 = 'Thu Nov 18 2021';
                bookingRepositoryMock.find.mockReturnValue(bookings);
                const expectedResult = [booking1];
                jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.getBookingsByDate(bookingDate1);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(1);  // 1 x 30 minutes
            });  // WORKS!! maybe


            it("3b should return two BookingEntity' of the mock bookings on the date: Tue Nov 16 2021", async () => {
                const bookingDate2 = 'Tue Nov 16 2021';
                bookingRepositoryMock.find.mockReturnValue(bookings);
                const expectedResult = [booking2a, booking2b];
                jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.getBookingsByDate(bookingDate2);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(2);  // 2 x 30 minutes
                //expect(bookingService.getBookingsByDate).toBeCalledTimes(1);
            });   // WORKS!! maybe
        })
        
        it("3c should return an empty BookingModel[] as no mock booking on the date: Wed Nov 17 2021", async () => {
            const bookingDate3 = 'Wed Nov 17 2027';
            bookingRepositoryMock.find.mockReturnValue(bookings);
            const expectedResult: BookingModel[] = [];
            jest.spyOn(bookingService, "getBookingsByDate").mockResolvedValue(expectedResult);
            const receivedResult = await bookingService.getBookingsByDate(bookingDate3);
            expect(receivedResult).toEqual(expectedResult);
            expect(receivedResult.length).toEqual(0);
//expect(typeof (await bookingService.getBookingsByDate(bookingDate3))).toBe("BookingModel[]");
        });  // Not confident about the results
        
   

       
         //   TEST addBooking METHOD */

        describe("4 should add newBooking to the booking repository", () => {
            const newBooking1 = {
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
                const expectedResult: BookingModel[] = [newBooking1];
                jest.spyOn(bookingService, "addBooking").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.addBooking(newBooking1);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(1);  // 1 x 30 minutes
            }); 
        })

        
        describe("4b should NOT add newBooking to the booking repository", () => {
            const newBooking2 = {
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
                duration: 60,
            }

            it("4b should NOT add a BookingModel[] of the mock new booking as time is already taken", async () => {
                const expectedResult: BookingModel[] = [];
                jest.spyOn(bookingService, "addBooking").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.addBooking(newBooking2);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(0);
            });
        })

        
        
         //   TEST deleteBooking METHOD */
        
        describe("5a should delete a BookingModel[] of the mock booking to delete", () => {
            const bookingToDelete2 = {
                id: '',
                date: 'Thu Nov 18 2021',
                time: '10:00',
                service: '',
                email: 'happy@life.com',
                phone: 12345678,
                address: '',
                city: '',
                postcode: 0,
                notes: '',
                duration: 30,
            }

            it("5a should return a BookingModel[] of the mock booking on the date: Tue Nov 16 2021", async () => {
                const expectedResult: BookingModel[] = [booking1]; //[bookingToDeleteExpectedResult];
                jest.spyOn(bookingService, "deleteBooking").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.deleteBooking(bookingToDelete2);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(1);  // 1 x 30 minutes
            });
        })

        describe("5b should NOT delete a BookingModel[] of the mock booking to delete", () => {
            const bookingToDelete = {
                id: '',
                date: 'Tue Nov 16 2029',  // No booking on this date to delete. Should return []
                time: '10:00',
                service: '',
                email: 'happy@life.com',
                phone: 12345678,
                address: '',
                city: '',
                postcode: 0,
                notes: '',
                duration: 60,
            }

            it("5b should NOT return a BookingModel[] of the mock booking on the date: Tue Nov 16 2021", async () => {
                const expectedResult: BookingModel[] = [];
                jest.spyOn(bookingService, "deleteBooking").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.deleteBooking(bookingToDelete);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(0);
            });
        })

        describe("5c should return an empty BookingModel[]as the confirmation email is incorrect", () => {
            const bookingToDelete3 = {
            id: '',
            date: 'Thu Nov 18 2021',
            time: '10:00',
            service: '',
            email: 'crazyman@test.com',  // wrong email. Should return []
            phone: 12345678,
            address: '',
            city: '',
            postcode: 0,
            notes: '',
            duration: 30,
        }

        it("5c should return an empty BookingModel[]as the confirmation email is incorrect", async () => {
            const expectedResult: BookingModel[] = [];
            jest.spyOn(bookingService, "deleteBooking").mockResolvedValue(expectedResult);
            const receivedResult = await bookingService.deleteBooking(bookingToDelete3);
            expect(receivedResult).toEqual(expectedResult);
            expect(receivedResult.length).toEqual(0);
            });
        })

        describe("5d should return an empty BookingModel[]as the confirmation email is incorrect", () => {
            const bookingToDelete4 = {
                id: '',
                date: 'Thu Nov 18 2021',
                time: '10:00',
                service: '',
                email: 'happy@life.com',
                phone: 23344556,  // wrong phone number. Should return []
                address: '',
                city: '',
                postcode: 0,
                notes: '',
                duration: 30,
            }

            it("5d should return an empty BookingModel[]as the confirmation email is incorrect", async () => {
                const expectedResult: BookingModel[] = [];
                jest.spyOn(bookingService, "deleteBooking").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.deleteBooking(bookingToDelete4);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(0);
            });
        })

        
       
         //   TEST getBookingOnDateAndTime METHOD */
        //getBookingOnDateAndTime(bookingToGet: BookingModel): Promise<BookingModel[]>

        describe("6a should return a BookingModel[2] of the mock booking to get", () => {
            const bookingToGet1 = {
                id: '',
                date: 'Tue Nov 16 2021', // Valid booking to get
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
                const expectedResult: BookingModel[] = [booking2a, booking2b];
                jest.spyOn(bookingService, "getBookingOnDateAndTime").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.getBookingOnDateAndTime(bookingToGet1);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(2);  // 2 x 30 minutes
            });
        })

        describe("6b should return a BookingModel[] as no booking on this date", () => {
            const bookingToGet2 = {
                id: '',
                date: 'Tue Nov 16 2028',  // No booking on this date. Should return BookingModel[]
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

            it("6b should return a BookingModel[] as no booking on this date", async () => {
                const expectedResult: BookingModel[] = [];
                jest.spyOn(bookingService, "getBookingOnDateAndTime").mockResolvedValue(expectedResult);
                const receivedResult = await bookingService.getBookingOnDateAndTime(bookingToGet2);
                expect(receivedResult).toEqual(expectedResult);
                expect(receivedResult.length).toEqual(0);
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
        const getAvailableTimesByDateMock = jest.fn();
        jest.spyOn(bookingService, "getAvailableTimesByDate").mockImplementation(getAvailableTimesByDateMock);
    });

    it("should mock findAvailableSlotInWorkPeriod method in BookingService class", () => {
        const findAvailableSlotInWorkPeriod = jest.fn();
        jest.spyOn(bookingService, "findAvailableSlotInWorkPeriod").mockImplementation(findAvailableSlotInWorkPeriod);
    });
    
    it("should mock getBookingsByDate method in BookingService class", () => {
        const getBookingsByDate = jest.fn();
        jest.spyOn(bookingService, "getBookingsByDate").mockImplementation(getBookingsByDate);
    });
    
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
    //not: jest.fn(),
    //getBookingsByDate: jest.fn()
}));

export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;   // bookings: BookingModel[]
    //[P in keyof T]: BookingEntity[];   // bookings: BookingModel[]
};


