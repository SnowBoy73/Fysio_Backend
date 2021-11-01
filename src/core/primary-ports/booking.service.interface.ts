import { BookingModel } from '../models/booking.model';

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel): Promise<BookingModel>;

    getBookingsByDate(date: string): Promise<BookingModel[]>; // needs to be sent time period
    
    deleteBooking(bookingToDelete: BookingModel): Promise<void>; // or id??

}
