import { BookingModel } from '../models/booking.model';
import {DateEnquiryModel} from "../../core/models/date-enquiry.model";

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel): Promise<BookingModel[]>;
    getAvailableTimesByDate(date: DateEnquiryModel): Promise<string[]>;
    getBookingsByDate(selectedDate: string): Promise<BookingModel[]>;
    deleteBooking(bookingToDelete: BookingModel): Promise<BookingModel[]>;
}
