import { AdminModel } from '../models/admin.model';

export const IAdminServiceProvider = 'IAdminServiceProvider';
export interface IAdminService {
    addAdmin(login: AdminModel): Promise<AdminModel>; // needed ??
    getAdmin(): Promise<AdminModel[]>;
    // edit  ??
    // delete ?? (not null)
}
