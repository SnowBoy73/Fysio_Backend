import {ServicesModel} from "../models/services.model";

export const IServicesServiceProvider = 'IServicesServiceProvider';
export interface  IServicesService {
    getAllServices(): Promise<ServicesModel[]>;
}
