import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingModel } from '../models/booking.model';
import { IBookingService, IBookingServiceProvider } from "../primary-ports/booking.service.interface";
import { BookingEntity } from '../../infrastructure/data-source/entities/booking.entity';
import {DateEnquiryModel} from "../../core/models/date-enquiry.model";
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

    /*
    // Super stupid way to populate the Timetable DB, but after 3 other methods failed, this worked. Yay 
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
     */

    setDaysWorkHours(date: string): void {
        console.log('setDaysWorkHours called: Date = ' + date);
        console.log('this.timetable.length = ' + this.timetable.length);

        let dayFound: boolean = false;
        for (let i = 0; i < this.timetable.length; i++) {
            let dayToCheck: TimetableEntity = this.timetable[i];
            let dayOfBooking = date.split(' ')[0];
            if(dayToCheck.day == dayOfBooking) {
                this.startTime = dayToCheck.startTime;
                this.breakStart = dayToCheck.breakStart;
                this.breakFinish = dayToCheck.breakFinish;
                this.finishTime = dayToCheck.finishTime;
                let dayFound = true;
                console.log('dayOfBooking = '+ dayOfBooking);
                console.log('dayToCheck.day = '+ dayToCheck.day);
            }
        }
        if (dayFound === false) {
            //throw Error;
        }
        return null;
    }


    async getTimetable() {
        if (this.timetable == null) {
            this.timetable = await this.timetableRepository.find({});
        }
    }
    
    
    async getAvailableTimesByDate(selectedDateAndDuration: DateEnquiryModel): Promise<string[]> {
        // Returns a string array of available times from a DateEnquiryModel
        if (selectedDateAndDuration != null) {
            await this.getTimetable();
            this.setDaysWorkHours(selectedDateAndDuration.date);
        // Get existing bookings on the date fromthe dateEnquiryModel
            const dBSearchDate = this.convertDateToDbFormat(selectedDateAndDuration.date);
            const bookingsOnSelectedDate: BookingEntity[] = await this.getBookingsByDate(dBSearchDate);
        // Convert returned bookings times to minutes after midnight
            const datesBookingTimesInMinutesAfterMidnight: number[] = [];
            for (let b = 0; b < bookingsOnSelectedDate.length; b++) {
                let convertedBookingTime = this.convertTimeToMinutesAfterMidnight(bookingsOnSelectedDate[b].time);
                datesBookingTimesInMinutesAfterMidnight.push(convertedBookingTime);
            }
        // Define work periods and convert their time slots to minutes after midnight
            const bookingSlotsNeeded: number = selectedDateAndDuration.duration / this.bookingSlotDuration;
            let startTimeAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.startTime);
            let breakStartAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.breakStart);
            let breakFinishAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.breakFinish);
            let finishTimeAsMinutesAfterMidnight: number = this.convertTimeToMinutesAfterMidnight(this.finishTime);
            const firstWorkPeriodAvailableSlots: string[] = this.findAvailableSlotInWorkPeriod(startTimeAsMinutesAfterMidnight, 
                breakStartAsMinutesAfterMidnight, bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
            const secondWorkPeriodAvailableSlots: string[] = this.findAvailableSlotInWorkPeriod(breakFinishAsMinutesAfterMidnight, 
                finishTimeAsMinutesAfterMidnight,bookingSlotsNeeded, datesBookingTimesInMinutesAfterMidnight);
            let allAvailableBookingTimesOnASelectedDate: string[] = firstWorkPeriodAvailableSlots.concat(secondWorkPeriodAvailableSlots);
            return allAvailableBookingTimesOnASelectedDate;
        } else {
            console.log('not a valid date selected');
            return [];
        }
    }


    findAvailableSlotInWorkPeriod(startTime: number, finishTime: number, bookingSlotsNeeded: number, 
                                  datesBookingTimesInMinutesAfterMidnight: number[]): string[] {
        const availableBookingTimes: string[] = [];
        let timeToCheck: number;
        for (let i = startTime; i <= finishTime - (bookingSlotsNeeded * this.bookingSlotDuration); i += this.bookingSlotDuration) {
            let bookingPossibleAtTimeI: boolean = true;
            for (let j = 0; j < bookingSlotsNeeded; j++) { // j = numbers of slots needed
                timeToCheck = i + (j * this.bookingSlotDuration);
                for (let k = 0; k < datesBookingTimesInMinutesAfterMidnight.length; k++) {  // k looks through all bookings on that day
                    if (timeToCheck == datesBookingTimesInMinutesAfterMidnight[k]){
                        bookingPossibleAtTimeI = false;
                        break;
                    }
                }
            }
            if (bookingPossibleAtTimeI) {
                let bookableTimeAsString: string = this.convertMinutesAfterMidnightToTime(i);
                availableBookingTimes.push(bookableTimeAsString);
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
        return bookingsOnSelectedDate;
    }


    async addBooking(newBooking: BookingModel): Promise<BookingModel[]> {
        const numberOfSlotsForBooking: number = newBooking.duration / this.bookingSlotDuration;
        const createdBookings: BookingModel[] = [];
        const convertedDate: string = this.convertDateToDbFormat(newBooking.date);
        // Added security check to make sure time is available 
        let checkIfBookingTimeIsAvailable: BookingModel[] = await this.getBookingOnDateAndTime(newBooking);
        if (checkIfBookingTimeIsAvailable) {
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
            return createdBookings;
        } else {
            console.log('SERVICE: addbooking ERROR: Time is not available');
        }
    }


    async deleteBooking(bookingToDelete: BookingModel): Promise<BookingModel[]> {
        console.log('SERVICE: deleteBooking called');

        // Super stupid way to populate the Timetable DB, but after 3 other methods failed, this worked. Yay
        //await this.populateTimetableDB();  // RUN ONCE !!!!

        // New method for getting booking to delete by UUID
        let bookingFoundToDelete: BookingModel[] = await this.getBookingByUUID(bookingToDelete);
        //
        // Old method for getting booking to delete by Time and Date. Replaced with getBookingByUUID()
        //let bookingFoundToDelete: BookingModel[] = await this.getBookingOnDateAndTime(bookingToDelete);
        //
        console.log('bookingFoundToDelete.length = ' + bookingFoundToDelete.length);

        if (bookingFoundToDelete.length !== 0) {
            let isAuthorisedToDelete = true;
            // Check that user is authorised to delete their booking
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
            return [];
        }
    }

    private async getBookingByUUID(bookingToDelete: BookingModel): Promise<BookingModel[]> {
        let bookingToDeleteByUUID: BookingModel[] = [];
        let bookingToGet: BookingModel = await this.bookingRepository.findOne({
            where: {id: bookingToDelete.id},
        });
        if (bookingToGet != null) {
            let bookingToGetDate: string = this.convertDateToDbFormat(bookingToGet.date);
            let numberOfBookingSlots = bookingToGet.duration / this.bookingSlotDuration;
            for (let i = 0; i < numberOfBookingSlots; i++) {
                let bookingTimeInMinutesAfterMidnight =
                    (this.convertTimeToMinutesAfterMidnight(bookingToGet.time) + (i * this.bookingSlotDuration));

                 console.log('bookingTimeInMinutesAfterMidnight [' + i + '] = ' + bookingTimeInMinutesAfterMidnight);
                let bookingTime = this.convertMinutesAfterMidnightToTime(bookingTimeInMinutesAfterMidnight);
                console.log('bookingToGetDate = [' + i + '] = ' + bookingToGetDate);
                console.log('bookingTime = [' + i + '] = ' + bookingTime);
                let bookingAtGivenDateAndTime: BookingModel = await this.bookingRepository.findOne({
                    where: {date: bookingToGetDate, time: bookingTime},
                });
                console.log('bookingAtGivenDateAndTime = [' + i + '] = ' + bookingAtGivenDateAndTime);
                if (bookingAtGivenDateAndTime) {
                    bookingToDeleteByUUID.push(bookingAtGivenDateAndTime)
                }
            }
        }
        console.log('bookingFoundByUUID = ' + bookingToDeleteByUUID);
        return bookingToDeleteByUUID;
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
        return bookableTimeAsString;
    }


    convertTimeToMinutesAfterMidnight(time: string): number {
        let timeAsNumberArray: number[] = [];
        const splitTimeString = time.split(':');
        timeAsNumberArray[0] = parseInt(splitTimeString[0]);
        timeAsNumberArray[1] = parseInt(splitTimeString[1]);
        let timeInMinutesAfterMidnight: number = (timeAsNumberArray[0] * 60) + (timeAsNumberArray[1]);
        return timeInMinutesAfterMidnight;
    }


    convertDateToDbFormat(dateToConvert: string): string {
        const splitDate: string[] = dateToConvert.split(' ');
        const day = splitDate[0];
        const month = splitDate[1];
        const date = splitDate[2];
        const year = splitDate[3];
        const convertedDate = day + ' ' + month + ' ' + date + ' ' + year;
        console.log('convertedDate = ' + convertedDate );
        return convertedDate;
    }
    
}

