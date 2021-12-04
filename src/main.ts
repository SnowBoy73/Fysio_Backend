import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });
  app.enableCors();

  await app.listen( 3004);  //  from best-playz
 /* await app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port); 
  }); */  // https://shivamv12.medium.com/deploy-nestjs-on-heroku-in-5-simple-steps-cc7625ea6167
}
bootstrap();
