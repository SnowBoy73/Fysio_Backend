import { BookingModel } from '../models/booking.model';
import {dateEnquiryModel} from "../../api/dtos/date-enquiry.model";

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel[]): Promise<BookingModel[]>;

    getAvailableTimesByDate(date: dateEnquiryModel): Promise<string[]>;
    
    deleteBooking(bookingToDelete: BookingModel[]): Promise<string>; // or id??

}
