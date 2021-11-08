import { Inject, Injectable } from '@nestjs/common';
import { BookingModel } from '../models/booking.model';
import { IBookingService, IBookingServiceProvider } from "../primary-ports/booking.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../infrastructure/data-source/entities/booking.entity';
import { Repository } from 'typeorm';
//import { SharedService } from '../services/shared.service';
//import { ISharedService, ISharedServiceProvider } from "../primary-ports/shared.service.interface";

@Injectable()
export class BookingService implements IBookingService {

    constructor(
        //@Inject(ISharedServiceProvider) private sharedService: ISharedService,
        @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
    ) {}

    async addBooking(newBooking: BookingModel): Promise<BookingModel> {
    return null;
    }

    async getBookingsByDate(date: string): Promise<BookingModel[]> {
       return null;  // TEMP
    }

    async deleteBooking(bookingToDelete: BookingModel): Promise<void> { // or id??
        return null;  // TEMP

    }

    
    
    
    /* async addClient(client: ClientModel): Promise<ClientModel> {
         const clientFoundById = await this.clientRepository.findOne({ id: client.id});
         if (clientFoundById) {
             return JSON.parse(JSON.stringify(clientFoundById));
         }
         const clientFoundByEmail = await this.clientRepository.findOne({ email: client.email});
         if (clientFoundByEmail) {
             throw new Error('Email already used');
         }
         let newClient = this.clientRepository.create();
         newClient.email = client.email;
         newClient = await this.clientRepository.save(client);
         const newClient = JSON.parse(JSON.stringify(client));
         return newClient; // maybe
     }
 
     async getClients(): Promise<ClientModel[]> {
         const clients = await this.clientRepository.find();
         const allClients: ClientModel[] = JSON.parse(JSON.stringify(clients));
         return allClients;
     }
 
     async deleteClient(id: string): Promise<void> {
         await this.clientRepository.delete({ id: id });
     }
 */
    /*
    getNextWeeksBookings(): BookingModel[] {
        console.log('currentHighscore = ', this.currentHighscore);
        return this.currentHighscore;
    } */
}
