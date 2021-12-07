import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingEntity } from '../entities/booking.entity';
import {ServicesEntity} from "../entities/services.entitiy";
import {TimetableEntity} from "../entities/timetable.entity";
import {AdminEntity} from "../entities/admin.entity";
//import {AdminEntity} from "../entities/admin.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DB'),
                entities: [BookingEntity, ServicesEntity, TimetableEntity, AdminEntity],
                synchronize: true, //true for DEV, but deletes data if DB is shutdown, // false for PRODUCTION
                /*ssl: true, // Remove this for local Docker to works !!! Enable for deployment
                extra: {
                  ssl: {
                    rejectUnauthorized: false,
                  },
                }, // */
            }),
        }),
    ],
})
export class DatabaseModule {}
