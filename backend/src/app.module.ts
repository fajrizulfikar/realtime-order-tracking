import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config';
import { LoggerService } from './services/logger.service';

@Module({
  imports: [AppConfigModule],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
