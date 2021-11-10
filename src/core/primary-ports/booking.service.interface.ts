import { BookingModel } from '../models/booking.model';

export const IBookingServiceProvider = 'IBookingServiceProvider';
export interface IBookingService {
    addBooking(newBooking: BookingModel[]): Promise<BookingModel[]>;

    getBookingsByDate(date: string): Promise<BookingModel[]>;
    
    deleteBooking(bookingToDelete: BookingModel[]): Promise<string>; // or id??

}
