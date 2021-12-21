import {Body, 
    Controller,
        Delete,
        Get,
        Inject,
        Param,
        Post,
        Put,
        Query,
} from '@nestjs/common';

import {IServicesService, IServicesServiceProvider} from '../../core/primary-ports/services.service.interface';
import { ServicesService } from "../../core/services/services.service";
import {ServicesModel} from "../../core/models/services.model";

@Controller('services')
export class ServicesController {
    constructor(
        @Inject(IServicesServiceProvider)
        private servicesService: IServicesService,
    ) {}
    
    
    @Get('allServices')
    async getAll(): Promise<ServicesModel[]> {
        console.log('SERVICES CONTROLLER getAll called');

        return await this.servicesService.getAllServices();
    }

}