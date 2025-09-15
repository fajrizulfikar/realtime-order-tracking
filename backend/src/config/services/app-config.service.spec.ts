import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return app config', () => {
    const mockAppConfig = {
      nodeEnv: 'test',
      port: 3000,
      logLevel: 'info',
    };

    const getSpy = jest
      .spyOn(configService, 'get')
      .mockReturnValue(mockAppConfig);

    expect(service.config).toEqual(mockAppConfig);
    expect(getSpy).toHaveBeenCalledWith('app');
  });

  it('should throw error when config is missing', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => service.config).toThrow('App configuration is missing');
  });

  it('should correctly identify development environment', () => {
    const mockAppConfig = { nodeEnv: 'development' };
    jest.spyOn(configService, 'get').mockReturnValue(mockAppConfig);

    expect(service.isDevelopment()).toBe(true);
    expect(service.isProduction()).toBe(false);
    expect(service.isTest()).toBe(false);
  });

  it('should correctly identify production environment', () => {
    const mockAppConfig = { nodeEnv: 'production' };
    jest.spyOn(configService, 'get').mockReturnValue(mockAppConfig);

    expect(service.isDevelopment()).toBe(false);
    expect(service.isProduction()).toBe(true);
    expect(service.isTest()).toBe(false);
  });

  it('should correctly identify test environment', () => {
    const mockAppConfig = { nodeEnv: 'test' };
    jest.spyOn(configService, 'get').mockReturnValue(mockAppConfig);

    expect(service.isDevelopment()).toBe(false);
    expect(service.isProduction()).toBe(false);
    expect(service.isTest()).toBe(true);
  });
});
