import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/data-source/postgres/database.module';
import * as Joi from '@hapi/joi';
import { AdminController } from './api/controllers/admin.controller';
//import { AdminModule } from './api/admin.module';
import { BookingModule } from './api/booking.module';
import {AdminService} from "./core/services/admin.service";

@Module({
  imports: [
    //AdminModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    BookingModule,
  ],
  controllers: [], // AdminController
  providers: [
  ],
})
export class AppModule {}
