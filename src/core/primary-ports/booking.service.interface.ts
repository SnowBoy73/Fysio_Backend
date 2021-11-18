import { BookingModel } from '../models/booking.model';
import {dateEnquiryModel} from "../../api/dtos/date-enquiry.model";

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel, duration: number): Promise<BookingModel[]>;

    getAvailableTimesByDate(date: dateEnquiryModel): Promise<string[]>;

    convertDateToDbFormat(dateToConvert: string): string;

    getBookingsByDate(selectedDate: string): Promise<BookingModel[]>;

    deleteBooking(bookingToDelete: BookingModel[]): Promise<string>; // or id??

}
