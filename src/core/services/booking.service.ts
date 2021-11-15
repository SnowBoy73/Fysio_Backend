import { Inject, Injectable } from '@nestjs/common';
import { BookingModel } from '../models/booking.model';
import { IBookingService, IBookingServiceProvider } from "../primary-ports/booking.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../infrastructure/data-source/entities/booking.entity';
import { Repository } from 'typeorm';
import {async, forkJoin} from "rxjs";
import {dateEnquiryModel} from "../../api/dtos/date-enquiry.model";

@Injectable()
export class BookingService implements IBookingService {
    availableTimes: string[];
    startTime: string = '8:00'; // mock - will fetch from timetable DB table
    breakStart: string = '11:00'; // mock - will fetch from timetable DB table
    breakFinish: string = '12:00'; // mock - will fetch from timetable DB table
    finishTime: string = '16:00'; // mock - will fetch from timetable DB table
    bookingSlotDuration: number = 30;  // minutes in a booking slot - get from admin table in DB later
    
    constructor(
        @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
    ) {}

    
    async getAvailableTimesByDate(selectedDateAndDuration: dateEnquiryModel): Promise<string[]> {
        if (selectedDateAndDuration != null) {
            console.log('Service: getAvailableTimesByDate');
            const dBSearchDate = this.convertDateToDbFormat(selectedDateAndDuration.date);
            console.log('Booking duration = ' + selectedDateAndDuration.duration + ' minutes');

            const dbSearchResults: string[] = [];  // NEEDED??
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

            //const 
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
                        // console.log(' = TRUE');
                        bookingPossibleAtTimeI = false;
                        break;
                    } else {
                        // console.log(' = FALSE');
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
        //return null; //MOCK
        return availableBookingTimes;
    }


    convertMinutesAfterMidnightToTime(timeInMinutes: number): string {
        const bookableTimeHour: string = Math.trunc((timeInMinutes / 60)).toString();
        let bookableTimeMinutes: string = (timeInMinutes % 60).toString();
        if (bookableTimeMinutes === '0') {
             bookableTimeMinutes = '00';
        }
        const bookableTimeAsString: string = bookableTimeHour + ':' + bookableTimeMinutes;
        console.log('bookableTimeAsString =  ' + bookableTimeAsString);
        return bookableTimeAsString;  
    }

    
        convertTimeToMinutesAfterMidnight(time: string): number {
        let timeAsNumberArray: number[] = [];
        const splitTimeString = time.split(':');
        timeAsNumberArray[0] = parseInt(splitTimeString[0]);
        timeAsNumberArray[1] = parseInt(splitTimeString[1]);
        console.log('bookingTime hour = ' + timeAsNumberArray[0] + ' minute = ' + timeAsNumberArray[1]);
        let timeInMinutesAfterMidnight: number = (timeAsNumberArray[0] * 60) + (timeAsNumberArray[1]);
        console.log('timeInMinutesAfterMidnight = ' + timeInMinutesAfterMidnight);
        return timeInMinutesAfterMidnight;
    }
    
    
    convertDateToDbFormat(dateToConvert: string): string {
        const splitDate: string[] = dateToConvert.split(' ');
        const day = splitDate[0];
        const month = splitDate[1];
        const date = splitDate[2];
        const year = splitDate[3];
        console.log('day = ' + day );
        console.log('month = ' + month );
        console.log('date = ' + date );
        console.log('year = ' + year );
        const convertedDate = day + ' ' + month + ' ' + date + ' ' + year;
        console.log('convertedDate = ' + convertedDate );
        return convertedDate;
    }


    async getBookingsByDate(selectedDate: string): Promise<BookingModel[]> {  // replace by enquiry??
         const bookingsOnSelectedDate: BookingEntity[] = await this.bookingRepository.find({ 
         where: {date: selectedDate},
         });
            console.log('bookingsOnSelectedDate.length = ' + bookingsOnSelectedDate.length );
        return bookingsOnSelectedDate;
   }


    async addBooking(newBooking: BookingModel[]): Promise<BookingModel[]> {
        console.log('booking service: addBooking');
        console.log('newBooking length: ' + newBooking.length);
        const bookingAdded: BookingModel[] = [];
// NEW... need to cycle through booking array
        for (let i = 0; i < newBooking.length; i++) {
            const converted = this.convertDateToDbFormat(newBooking[i].date);
            console.log(' bookingdate: ', newBooking[i].date);
            console.log('converted bookingdate: ', converted);
            let createBooking = this.bookingRepository.create();
            createBooking.date = this.convertDateToDbFormat(newBooking[i].date);
            createBooking.time = newBooking[i].time;
            createBooking.service = newBooking[i].service;
            createBooking.email = newBooking[i].email;
            createBooking.phone = newBooking[i].phone;
            createBooking.address = newBooking[i].address;
            createBooking.city = newBooking[i].city;
            createBooking.postcode = newBooking[i].postcode;
            createBooking.notes = newBooking[i].notes;
            createBooking = await this.bookingRepository.save(createBooking);
            bookingAdded.push(createBooking);
            console.log('SERVICE: pushes booking: ', createBooking);
        }
        console.log('bookingAdded length: ', bookingAdded.length);
        const addedBooking = JSON.parse(JSON.stringify(bookingAdded));
            console.log('SERVICE: returns booking: ', addedBooking);
            return addedBooking;  // will this work??
    }

  
    async deleteBooking(bookingToDelete: BookingModel[]): Promise<string> { // success message (error??)
        return null;  // TEMP

    }





    // old version of method - to remove
    /* async enquireForAvailability(enquiryDuration: dateEnquiryModel[]): Promise<string[]> { // maybe time value
         console.log('enquiryDuration.length = ', enquiryDuration.length);
         const enquiryAvailable: boolean = true;
         /*   for (let i = this.startTime; i < (this.finishTime - duration); i++) { //tricky
                
                for (let j = 0; j < enquiryDuration.length; j++) {
                    
                }            const test = await this.bookingRepository.findOne({
                    where: {date: enquiryDuration[i].date, time: newBooking[i].time},
    
                });  
         if (true) { // available
             console.log('TIME SLOT IS AVAILABLE !! Adding Booking');
         } else {
             //console.log('Booking already  found - id:' + bookingDB.date + '  email: ' + bookingDB.email);
             console.log('DB NOT UPDATED');
         }
         return null;  // mock
     }
 */


    
}
