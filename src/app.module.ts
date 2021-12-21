import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure/data-source/postgres/database.module';
import { BookingModule } from './api/booking.module';
import { ServicesModule } from './api/services.module';


@Module({
  imports: [
    /*
      TypeOrmModule.forFeature(
        [ServicesEntity, BookingEntity , TimetableEntity, AdminEntity],
    ),
*/
    //TypeOrmModule.forRoot(),
    BookingModule,
    DatabaseModule,
    ServicesModule,
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
  controllers: [],
  providers: [],
})
export class AppModule {}
