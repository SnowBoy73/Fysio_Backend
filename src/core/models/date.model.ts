import {BookingModel} from "./booking.model";

export interface DateModel {
    date: string;
    bookings: BookingModel[];
}
