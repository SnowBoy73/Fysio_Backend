import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Query} from '@nestjs/common';
import { AdminModel } from '../../core/models/admin.model';
import { IAdminService, IAdminServiceProvider } from '../../core/primary-ports/admin.service.interface';

@Controller('admin')
export class AdminController {
    constructor(
        @Inject(IAdminServiceProvider)
        private adminService: IAdminService,
    ) {}

    @Get()
    async get() {
        return await this.adminService.getAdmin();
    }

    @Post()
    async create(@Body() adminToBeCreated: AdminModel) {
        const newAdmin = await this.adminService.addAdmin(adminToBeCreated);
        return newAdmin;
    }
}
