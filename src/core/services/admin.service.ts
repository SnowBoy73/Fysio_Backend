import { Inject, Injectable } from '@nestjs/common';
import { AdminModel } from '../models/admin.model';
import {IAdminService} from '../primary-ports/admin.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../../infrastructure/data-source/entities/admin.entity';

@Injectable()
export class AdminService implements IAdminService {

    constructor(
        // @Inject(ISharedServiceProvider) private sharedService: ISharedService,
        @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    ) {}

    async addAdmin(adminToCreate: AdminModel): Promise<AdminModel> {
        //const posted = this.sharedService.generateDateTimeNowString();
        console.log( 'Admin model: ', adminToCreate.username, adminToCreate.password);
        let createAdmin = this.adminRepository.create();
        createAdmin.username = adminToCreate.username;
        createAdmin.password = adminToCreate.password;
        createAdmin = await this.adminRepository.save(createAdmin);
        const newAdmin = JSON.parse(JSON.stringify(createAdmin));
        return newAdmin;
    }

    async getAdmin(): Promise<AdminModel[]> {
        const loginDB = await this.adminRepository.find();
        const admin: AdminModel[] = JSON.parse(JSON.stringify(loginDB));
        return admin;
    }
}
