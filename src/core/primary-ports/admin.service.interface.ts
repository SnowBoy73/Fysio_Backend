import { AdminModel } from '../models/admin.model';

export const IAdminServiceProvider = 'IAdminServiceProvider';
export interface IAdminService {
    addAdmin(login: AdminModel): Promise<AdminModel>;
    getAdmin(): Promise<AdminModel[]>;
}
