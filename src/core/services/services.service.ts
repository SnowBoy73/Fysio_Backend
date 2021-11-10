import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IServicesService} from "../primary-ports/services.service.interface";
import {ServicesEntity} from "../../infrastructure/data-source/entities/services.entitiy";
import {ServicesModel} from "../models/services.model";

@Injectable()
export class ServicesService implements IServicesService {

    constructor(
        @InjectRepository(ServicesEntity) private servicesRepository: Repository<ServicesEntity>,
    ) {}

    async getAllServices(): Promise<ServicesModel[]> {
        return null; // mock
    }

}
