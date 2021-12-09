import {ServicesModel} from "../models/services.model";

export const ISharedServiceProvider = 'ISharedServiceProvider';
export interface  ISharedService {

    getAllServices(): Promise<ServicesModel[]>;
    
}