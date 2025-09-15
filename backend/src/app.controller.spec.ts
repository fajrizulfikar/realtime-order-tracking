import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './services/logger.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!" message', () => {
      const result = appController.getHello();
      expect(result).toEqual({ message: 'Hello World!' });
    });

    it('should return personalized greeting', () => {
      const result = appController.createPersonalizedGreeting({ name: 'John' });
      expect(result).toEqual({
        message: 'Hello, John!',
        name: 'John',
      });
    });
  });
});
