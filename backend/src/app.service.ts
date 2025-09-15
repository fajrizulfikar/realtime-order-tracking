import { Injectable } from '@nestjs/common';
import { HelloResponse, PersonalizedGreetingResponse } from './types/app.types';
import { CreateGreetingDto } from './dto/hello.dto';
import { LoggerService } from './services/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  getHello(): HelloResponse {
    this.logger.log('Default greeting requested', 'AppService');
    return {
      message: 'Hello World!',
    };
  }

  createPersonalizedGreeting(
    createGreetingDto: CreateGreetingDto,
  ): PersonalizedGreetingResponse {
    this.logger.log(
      `Personalized greeting requested for: ${createGreetingDto.name}`,
      'AppService',
    );
    return {
      message: `Hello, ${createGreetingDto.name}!`,
      name: createGreetingDto.name,
    };
  }
}
