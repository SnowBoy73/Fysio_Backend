import { Inject, Injectable } from '@nestjs/common';
import { BookingModel } from '../models/booking.model';
import { IBookingService, IBookingServiceProvider } from "../primary-ports/booking.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../infrastructure/data-source/entities/booking.entity';
import { Repository } from 'typeorm';
import {EnquiryModel} from "../models/enquiry.model";
import {forkJoin} from "rxjs";

@Injectable()
export class BookingService implements IBookingService {
    availableTimes: string[];
    startTime: string = '9:00'; // mock - will fetch from timetable DB table
    finishTime: string = '17:00'; // mock - will fetch from timetable DB table
    
    constructor(
        @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
    ) {}

    
    
    
    async enquireForAvailability(enquiryDuration: EnquiryModel[]): Promise<string[]> { // maybe time value

        console.log('enquiryDuration.length = ', enquiryDuration.length);
        const enquiryAvailable: boolean = true;
        
        
     /*   for (let i = this.startTime; i < (this.finishTime - duration); i++) { //tricky
            
            for (let j = 0; j < enquiryDuration.length; j++) {
                
            }            const test = await this.bookingRepository.findOne({
                where: {date: enquiryDuration[i].date, time: newBooking[i].time},

            });
        */

        if (true) { /* available*/
            console.log('TIME SLOT IS AVAILABLE !! Adding Booking');

        } else {
    //console.log('Booking already  found - id:' + bookingDB.date + '  email: ' + bookingDB.email);
    console.log('DB NOT UPDATED');
        }
        return null;  // mock
    }

    
    
    async addBooking(newBooking: BookingModel[]): Promise<BookingModel[]> {
        console.log('booking service: addBooking');
// NEW... need to cycle through booking array

        for (let i = 0; i < newBooking.length; i++) {


            let createBooking = this.bookingRepository.create();
            createBooking.date = newBooking[i].date;
            createBooking.time = newBooking[i].time;
            createBooking.service = newBooking[i].service;
            createBooking.email = newBooking[i].email;
            createBooking.phone = newBooking[i].phone;
            createBooking.address = newBooking[i].address;
            createBooking.city = newBooking[i].city;
            createBooking.postcode = newBooking[i].postcode;
            createBooking.notes = newBooking[i].notes;
            createBooking = await this.bookingRepository.save(createBooking);
            const addedBooking = JSON.parse(JSON.stringify(createBooking));
            console.log('SERVICE: returns booking: ', addedBooking);
            
        }
        
            return newBooking;  // will this work??
    }

    
    async getBookingsByDate(date: string): Promise<BookingModel[]> {  // replace by enquiry??
       return null;  // TEMP
    }

    async deleteBooking(bookingToDelete: BookingModel[]): Promise<string> { // success message (error??)
        return null;  // TEMP

    }
    
}
