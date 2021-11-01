import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminEntity} from "../infrastructure/data-source/entities/admin.entity";
import {IBookingServiceProvider} from "../core/primary-ports/booking.service.interface";
import {BookingService} from "../core/services/booking.service";
import {IAdminServiceProvider} from "../core/primary-ports/admin.service.interface";
import {AdminService} from "../core/services/admin.service";
import {AdminController} from "./controllers/admin.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([AdminEntity]),

    ],
    controllers: [AdminController],
    providers: [ AdminService
       /* AdminController,
        {
            provide: IAdminServiceProvider,
            useClass: AdminService,
        }*/
    ], // inject services??
})
export class AdminModule {}
