import {Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IServicesService, IServicesServiceProvider} from "../primary-ports/services.service.interface";
import {ServicesEntity} from "../../infrastructure/data-source/entities/services.entitiy";
import {ServicesModel} from "../models/services.model";

@Injectable()
export class ServicesService implements IServicesService {

    constructor(
        @InjectRepository(ServicesEntity) private servicesRepository: Repository<ServicesEntity>,
    ) {}

    async getAllServices(): Promise<ServicesModel[]> {
        console.log('SHARED SERVICE: getAllServices started');
        const allServices: ServicesEntity[] = await this.servicesRepository.find();
        console.log('-----allServices.length = ' + allServices.toString() );
        return allServices;
    }

}
