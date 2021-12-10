import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors({
   /* origin: "http://localhost:4200",
    credentials: true */  // From Nedas
    origin: true,  // from BestPlays
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',  // from BestPlays
  });
  
  //app.enableCors();  // TEMP removed

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3004);  // best-playz
  //await app.listen(process.env.PORT || 8080); // https://shivamv12.medium.com/deploy-nestjs-on-heroku-in-5-simple-steps-cc7625ea6167
}
bootstrap();