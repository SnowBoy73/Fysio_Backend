import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingModel } from '../models/booking.model';
import { IBookingService, IBookingServiceProvider } from "../primary-ports/booking.service.interface";
import { BookingEntity } from '../../infrastructure/data-source/entities/booking.entity';
import {dateEnquiryModel} from "../../api/dtos/date-enquiry.model";
import {TimetableEntity} from "../../infrastructure/data-source/entities/timetable.entity";

@Injectable()
export class BookingService implements IBookingService {
    availableTimes: string[];
    timetable: TimetableEntity[] = null;
    /* MOCK
    startTime: string = '8:00'; // mock - will fetch from timetable DB table
    breakStart: string = '11:00'; // mock - will fetch from timetable DB table
    breakFinish: string = '12:00'; // mock - will fetch from timetable DB table
    finishTime: string = '18:00'; // mock - will fetch from timetable DB table
     */
    startTime: string = '';
    breakStart: string = '';
    breakFinish: string = '';
    finishTime: string = '';
    bookingSlotDuration: number = 30;  // minutes in a booking slot - get from admin table in DB later

    constructor(
        @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
        @InjectRepository(TimetableEntity) private timetableRepository: Repository<TimetableEntity>,
    ) {}

    async populateTimetableDB():Promise<void> {
        let mon = this.timetableRepository.create();
        mon.id = '7401177d-65d9-439a-87ea-18e86c79eb7b';
        mon.day = 'Mon';
        mon.startTime = '9:00';
        mon.breakStart = '12:00';
        mon.breakFinish = '13:00';
        mon.finishTime = '17:00';
        await this.timetableRepository.save(mon);
        let tue = this.timetableRepository.create();
        tue.id = '7402177d-65d9-439a-87ea-18e86c79eb7b';
        tue.day = 'Tue';
        tue.startTime = '8:00';
        tue.breakStart = '12:00';
        tue.breakFinish = '13:00';
        tue.finishTime = '16:00';
        await this.timetableRepository.save(tue);
        let wed = this.timetableRepository.create();
        wed.id = '7403177d-65d9-439a-87ea-18e86c79eb7b';
        wed.day = 'Wed';
        wed.startTime = '8:30';
        wed.breakStart = '12:30';
        wed.breakFinish = '13:30';
        wed.finishTime = '16:30';
        await this.timetableRepository.save(wed);
        let thu = this.timetableRepository.create();
        thu.id = '7404177d-65d9-439a-87ea-18e86c79eb7b';
        thu.day = 'Thu';
        thu.startTime = '9:30';
        thu.breakStart = '12:30';
        thu.breakFinish = '13:30';
        thu.finishTime = '17:30';
        await this.timetableRepository.save(thu);
        let fri = this.timetableRepository.create();
        fri.id = '7405177d-65d9-439a-87ea-18e86c79eb7b';
        fri.day = 'Fri';
        fri.startTime = '8:30';
        fri.breakStart = '12:30';
        fri.breakFinish = '13:00';
        fri.finishTime = '14:30';
        await this.timetableRepository.save(fri);
        let sat = this.timetableRepository.create();
        sat.id = '7406177d-65d9-439a-87ea-18e86c79eb7b';
        sat.day = 'Sat';
        sat.startTime = '9:00';
        sat.breakStart = '9:00';
        sat.breakFinish = '9:00';
        sat.finishTime = '9:00';
        await this.timetableRepository.save(sat);
        let sun = this.timetableRepository.create();
        sun.id = '7407177d-65d9-439a-87ea-18e86c79eb7b';
        sun.day = 'Sun';
        sun.startTime = '9:00';
        sun.breakStart = '9:00';
        sun.breakFinish = '9:00';
        sun.finishTime = '9:00';
        await this.timetableRepository.save(sun);
    }
     
     setDaysWorkHours(date: string): void {
         console.log('setDaysWorkHours called: Date = ' + date);
         console.log('this.timetable.length = ' + this.timetable.length);

         let dayFound: boolean = false;
         for (let i = 0; i < this.timetable.length; i++) {
             let dayToCheck: TimetableEntity = this.timetable[i];
             let dayOfBooking = date.split(' ')[0];  // get day from timetable entity
             console.log('dayOfBooking = ' + dayOfBooking);

             if(dayToCheck.day == dayOfBooking) {
                 this.startTime = dayToCheck.startTime;
                 this.breakStart = dayToCheck.breakStart;
                 this.breakFinish = dayToCheck.breakFinish;
                 this.finishTime = dayToCheck.finishTime;
                 let dayFound = true;
             }
         }
         if (dayFound == false) {
             console.log('ERROR: dayOfBooking NOT FOUND - please check DB');
             //throw Error;
         }
        return null;
    }
    
    
    async getAvailableTimesByDate(selectedDateAndDuration: dateEnquiryModel): Promise<string[]> {
        if (selectedDateAndDuration != null) {
            
            console.log('this.timetable = ' + this.timetable);
            console.log('selectedDateAndDuration.date xx= ' + selectedDateAndDuration.date);

            if (this.timetable == null) {
                console.log('Fetching timetable from Repo' );

                this.timetable = await this.timetableRepository.find({});
                console.log('timetable from Repo = ' + this.timetable);
            } 
            this.setDaysWorkHours(selectedDateAndDuration.date);
            
            
            this.populateTimetableDB();  // RUN ONCE !!!!
            
            
            const dBSearchDate = this.convertDateToDbFormat(selectedDateAndDuration.date);
            console.log('Booking duration = ' + selectedDateAndDuration.duration + ' minutes');
// Get dates bookings and convert their times to minutes after midnight
            const bookingsOnSelectedDate: BookingEntity[] = await this.getBookingsByDate(dBSearchDate)
            console.log('bookingsOnSelectedDate = ' + bookingsOnSelectedDate);
            const datesBookingTimesInMinutesAfterMidnight: number[] = [];
            for (let b = 0; b < bookingsOnSelectedDate.length; b++) {
                let convertedBookingTime = this.convertTimeToMinutesAfterMidnight(bookingsOnSelectedDate[b].time);
                datesBookingTimesInMinutesAfterMidnight.push(convertedBookingTime);
            }
            console.log('datesBookingTimesInMinutesAfterMidnight = ' + datesBookingTimesInMinutesAfterMidnight);
// Define work periods and convert their time slots to minutes after midnight
            const bookingSlotsNeeded: number = selectedDateAndDuration.duration / this.bookingSlotDuration;  // Number of booking slots needed for booking
            console.log('bookingSlotsNeeded = ' + bookingSlotsNeeded);
            //
            let startTimeAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.startTime);
            let breakStartAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.breakStart);
            let breakFinishAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.breakFinish);
            let finishTimeAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.finishTime);
            console.log('startTimeAsMinutesAfterMidnight = ' + startTimeAsMinutesAfterMidnight);
            console.log('breakStartAsMinutesAfterMidnight = ' + breakStartAsMinutesAfterMidnight);
            console.log('breakFinishAsMinutesAfterMidnight = ' + breakFinishAsMinutesAfterMidnight);
            console.log('finishTimeAsMinutesAfterMidnight = ' + finishTimeAsMinutesAfterMidnight);
            console.log('Times for work period 1');
            const firstWorkPeriodAvailableSlots: string[] = this.findAvailableSlotInWorkPeriod(startTimeAsMinutesAfterMidnight, breakStartAsMinutesAfterMidnight, bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
            console.log('Times for work period 2');
            const secondWorkPeriodAvailableSlots: string[] = this.findAvailableSlotInWorkPeriod(breakFinishAsMinutesAfterMidnight, finishTimeAsMinutesAfterMidnight,bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
            console.log('Available booking Times for work period 1 = ' + firstWorkPeriodAvailableSlots);
            console.log('Available booking Times for work period 2 = ' + secondWorkPeriodAvailableSlots);
            let allAvailableBookingTimesOnASelectedDate: string[] = firstWorkPeriodAvailableSlots.concat(secondWorkPeriodAvailableSlots);
            console.log('allAvailableBookingTimesOnASelectedDate = ' + allAvailableBookingTimesOnASelectedDate);
            return allAvailableBookingTimesOnASelectedDate;
        } else {
            console.log('not a valid date selected');
            return [];
        }
    }

    
    findAvailableSlotInWorkPeriod(startTime: number, finishTime: number, bookingSlotsNeeded: number, datesBookingTimesInMinutesAfterMidnight: number[]): string[] {
        console.log('startTime: ' + startTime + 'finishTime: ' + finishTime + 'bookingSlotsNeeded: ' + bookingSlotsNeeded);
        const availableBookingTimes: string[] = [];
        let timeToCheck: number;
        for (let i = startTime; i <= finishTime - (bookingSlotsNeeded * this.bookingSlotDuration); i += this.bookingSlotDuration) {
            console.log(i);
            let bookingPossibleAtTimeI: boolean = true;
            for (let j = 0; j < bookingSlotsNeeded; j++) { // j = numbers of slots needed
                timeToCheck = i + (j * this.bookingSlotDuration);
                console.log('timeToCheck: ' + timeToCheck);
                for (let k = 0; k < datesBookingTimesInMinutesAfterMidnight.length; k++) {  // k looks through all booking on that day
                    // console.log('timeToCheck  ' + timeToCheck + ' =? ' + datesBookingTimesInMinutesAfterMidnight[k] + '  (datesBookingTimesInMinutesAfterMidnight)');
                    if (timeToCheck == datesBookingTimesInMinutesAfterMidnight[k]){
                        bookingPossibleAtTimeI = false;
                        break;
                    }
                }
            }
            console.log('Possible booking of ' + (bookingSlotsNeeded * this.bookingSlotDuration) + ' minutes at ' + i + ' = ' + bookingPossibleAtTimeI);
            if (bookingPossibleAtTimeI) {
                let bookableTimeAsString: string = this.convertMinutesAfterMidnightToTime(i);
                availableBookingTimes.push(bookableTimeAsString);
                console.log('Added possible booking time at ' + bookableTimeAsString);
            }
        }
        return availableBookingTimes;
    }


    async getBookingsByDate(selectedDate: string): Promise<BookingModel[]> {
        console.log('SERVICE: getBookingsByDate started');

        const bookingsOnSelectedDate: BookingEntity[] = await this.bookingRepository.find({
            where: {date: selectedDate},
        });
         console.log('-----bookingsOnSelectedDate.length = ' + bookingsOnSelectedDate.toString() );
        console.log('-----bookingsOnSelectedDate.selectedDate = ' + selectedDate );

        //  const updatedstock: Stock = JSON.parse(JSON.stringify(stockDB));  // NEED TO PARSE???
        return bookingsOnSelectedDate;
   }


    async addBooking(newBooking: BookingModel): Promise<BookingModel[]> {
        console.log('booking service: addBooking');
        const numberOfSlotsForBooking: number = newBooking.duration / this.bookingSlotDuration;
        console.log('numberOfSlotsForBooking: ' + numberOfSlotsForBooking);
        const createdBookings: BookingModel[] = [];  // NEEDED?
        const convertedDate: string = this.convertDateToDbFormat(newBooking.date);
        // Added security check to make sure time is available 
        let checkIfBookingTimeIsAvailable: BookingModel[] = await this.getBookingOnDateAndTime(newBooking);
        if (checkIfBookingTimeIsAvailable) {
            console.log('convertedDate: ', convertedDate);
            const bookingStartTimeInMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(newBooking.time);
//  Cycle through booking array
            for (let i = 0; i < numberOfSlotsForBooking; i++) {
                let bookingTimeInMinutesAfterMidnight: number = bookingStartTimeInMinutesAfterMidnight + (i * this.bookingSlotDuration);
                console.log('bookingTimeInMinutesAfterMidnight ' + i + ' = ' + bookingTimeInMinutesAfterMidnight);
                let bookingTime: string = this.convertMinutesAfterMidnightToTime(bookingTimeInMinutesAfterMidnight);
                console.log(' bookingTime ' + i + ' = ' + bookingTime);
                let createBooking = this.bookingRepository.create();
                createBooking.date = convertedDate;
                createBooking.time = bookingTime;
                createBooking.service = newBooking.service;
                createBooking.email = newBooking.email;
                createBooking.phone = newBooking.phone;
                createBooking.address = newBooking.address;
                createBooking.city = newBooking.city;
                createBooking.postcode = newBooking.postcode;
                createBooking.notes = newBooking.notes;
                createBooking.duration = newBooking.duration;
                createBooking = await this.bookingRepository.save(createBooking);
                createdBookings.push(createBooking);
                console.log('SERVICE: pushes booking: ', createBooking);
            }
            console.log('SERVICE: returns booking: ', createdBookings);
            //       const updatedstock: Stock = JSON.parse(JSON.stringify(stockDB));  // NEED TO PARSE???
            return createdBookings;  // will this work??
        } else {
            console.log('SERVICE: addbooking ERROR: Time is not available');
        }
    }

  
    async deleteBooking(bookingToDelete: BookingModel): Promise<BookingModel[]> {
        console.log('SERVICE: deleteBooking called');
        let bookingFoundToDelete: BookingModel[] = await this.getBookingOnDateAndTime(bookingToDelete);
        console.log('bookingFoundToDelete.length = ' + bookingFoundToDelete.length);

        if (bookingFoundToDelete.length !== 0) {
            let isAuthorisedToDelete = true;
            // Check that user is authorised to delete their booing
            for (let i = 0; i < bookingFoundToDelete.length; i++) {
                if ((bookingFoundToDelete[i].email != bookingToDelete.email)
                    || (bookingFoundToDelete[i].phone != bookingToDelete.phone)) {
                    // Email and phone don't match booking
                    console.log('SERVICE ERROR in deleteBooking: isAuthorisedToDelete = false');
                    isAuthorisedToDelete = false;
                }
            }
            if (isAuthorisedToDelete) {
                for (let i = 0; i < bookingFoundToDelete.length; i++) {
                    await this.bookingRepository.delete(bookingFoundToDelete[i]);
                }
                return bookingFoundToDelete;
            } else {
                // Not authorised to delete this booking
                console.log('SERVICE ERROR in deleteBooking: Not authorised to delete this booking');
                return []; // NEW for testing - should be error
            }
        } else {
            // No booking at that time found
            console.log('SERVICE ERROR in deleteBooking: No booking at that time found');
            return []; // NEW for testing - should be error
        }
    }

    
    async getBookingOnDateAndTime(bookingToGet: BookingModel): Promise<BookingModel[]> {
        let bookingFound: BookingModel[] = [];
        let bookingToGetDate: string = this.convertDateToDbFormat(bookingToGet.date);
        let numberOfBookingSlots = bookingToGet.duration / this.bookingSlotDuration;
        console.log('numberOfBookingSlots = ' + numberOfBookingSlots);
        for (let i = 0; i < numberOfBookingSlots; i++) {
            let bookingTimeInMinutesAfterMidnight = 
                (this.convertTimeToMinutesAfterMidnight(bookingToGet.time) + (i * this.bookingSlotDuration));

            // console.log('bookingTimeInMinutesAfterMidnight [' + i + '] = ' + bookingTimeInMinutesAfterMidnight);
            let bookingTime = this.convertMinutesAfterMidnightToTime(bookingTimeInMinutesAfterMidnight);
            console.log('bookingToGetDate = [' + i + '] = ' + bookingToGetDate);
            console.log('bookingTime = [' + i + '] = ' + bookingTime);
            let bookingAtGivenDateAndTime: BookingModel = await this.bookingRepository.findOne({
                where: {date: bookingToGetDate, time: bookingTime},
            });
            console.log('bookingAtGivenDateAndTime = [' + i + '] = ' + bookingAtGivenDateAndTime);
            if (bookingAtGivenDateAndTime) {
                bookingFound.push(bookingAtGivenDateAndTime)
            }
        }
        console.log('bookingFound = ' + bookingFound);
        return bookingFound;
    }
    
        
    convertMinutesAfterMidnightToTime(timeInMinutes: number): string {
        const bookableTimeHour: string = Math.trunc((timeInMinutes / 60)).toString();
        let bookableTimeMinutes: string = (timeInMinutes % 60).toString();
        if (bookableTimeMinutes === '0') bookableTimeMinutes = '00';  // returns '00' minutes rather than '0'. Eg 9:00
        const bookableTimeAsString: string = bookableTimeHour + ':' + bookableTimeMinutes;
        // console.log('bookableTimeAsString =  ' + bookableTimeAsString);
        return bookableTimeAsString;
    }

    
    convertTimeToMinutesAfterMidnight(time: string): number {
        let timeAsNumberArray: number[] = [];
        const splitTimeString = time.split(':');
        timeAsNumberArray[0] = parseInt(splitTimeString[0]);
        timeAsNumberArray[1] = parseInt(splitTimeString[1]);
        // console.log('bookingTime hour = ' + timeAsNumberArray[0] + ' minute = ' + timeAsNumberArray[1]);
        let timeInMinutesAfterMidnight: number = (timeAsNumberArray[0] * 60) + (timeAsNumberArray[1]);
        // console.log('timeInMinutesAfterMidnight = ' + timeInMinutesAfterMidnight);
        return timeInMinutesAfterMidnight;
    }
    
    
    convertDateToDbFormat(dateToConvert: string): string {
        const splitDate: string[] = dateToConvert.split(' ');
        const day = splitDate[0];
        const month = splitDate[1];
        const date = splitDate[2];
        const year = splitDate[3];
    /*    console.log('day = ' + day );
        console.log('month = ' + month );
        console.log('date = ' + date );
        console.log('year = ' + year ); */
        const convertedDate = day + ' ' + month + ' ' + date + ' ' + year;
        console.log('convertedDate = ' + convertedDate );
        return convertedDate;
    }


    
}
