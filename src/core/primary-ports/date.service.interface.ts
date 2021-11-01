import { DateModel } from '../models/date.model';
import {BookingModel} from "../models/booking.model";

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel): Promise<BookingModel>;

    getBookings(bookings: DateModel[]): Promise<DateModel[]>; // needs to be sent time period

    // editBookings ???

    deleteBooking(booking: BookingModel): Promise<void>; // or id??

}
