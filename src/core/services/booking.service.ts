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
    startTime: string = '9:00'; // mock - will fetch from timetable DB table
    finishTime: string = '17:00'; // mock - will fetch from timetable DB table
    
    constructor(
        @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
    ) {}

    
    async getAvailableTimesByDate(selectedDateAndDuration: dateEnquiryModel): Promise<string[]> {
       
        if (selectedDateAndDuration != null) {
            const dBSearchDate = this.convertDateToDbFormat(selectedDateAndDuration.date);
            console.log('Booking duration = ' + selectedDateAndDuration.duration + ' minutes');
            
            const dbSearchResults: string[] = [];
            
            // SELECT id FROM TAG_TABLE WHERE 'aaaaaaaa' LIKE '%' || tag_name || '%';
//             where: {date: enquiryDuration[i].date, time: newBooking[i].time},
               // const possibleBookings: BookingEntity[] = await this.bookingRepository.find();
            
            const bookingsOnSelectedDate: BookingEntity[] = await this.getBookingsByDate(dBSearchDate)
            console.log(bookingsOnSelectedDate);
            
        //    const allClients: ClientModel[] = JSON.parse(JSON.stringify(clients));
         //   return allClients;
            
        } else {
            console.log('not a valid date selected');

        }
        return Promise.resolve([]);
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
        return convertedDate
    }


    async getBookingsByDate(date: string): Promise<BookingModel[]> {  // replace by enquiry??
      return null;  // TEMP
   }


    async addBooking(newBooking: BookingModel[]): Promise<BookingModel[]> {
        console.log('booking service: addBooking');
        console.log('newBooking length: ' + newBooking.length);

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
            const addedBooking = JSON.parse(JSON.stringify(createBooking));
            console.log('SERVICE: returns booking: ', addedBooking);
        }
            return newBooking;  // will this work??
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
