import { Module } from '@nestjs/common';
import {ServicesEntity} from "../infrastructure/data-source/entities/services.entitiy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServicesGateway} from "./gateways/services.gateway";
import {ServicesService} from "../core/services/services.service";
import {IServicesServiceProvider} from "../core/primary-ports/services.service.interface";
import {ServicesController} from "./controllers/services.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ServicesEntity])],
    controllers: [ServicesController],
    providers: [
        {
            provide: IServicesServiceProvider,
            useClass: ServicesService,
        },
    ],

})
export class ServicesModule {}