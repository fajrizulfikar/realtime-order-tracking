import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloResponse, PersonalizedGreetingResponse } from './types/app.types';
import { CreateGreetingDto } from './dto/hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return this.appService.getHello();
  }

  @Post('greet')
  createPersonalizedGreeting(
    @Body(new ValidationPipe()) createGreetingDto: CreateGreetingDto,
  ): PersonalizedGreetingResponse {
    return this.appService.createPersonalizedGreeting(createGreetingDto);
  }

  @Get('health')
  getHealthStatus(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
