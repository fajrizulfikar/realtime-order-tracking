import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfigService } from './database-config.service';

describe('DatabaseConfigService', () => {
  let service: DatabaseConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return database config', () => {
    const mockDbConfig = {
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      name: 'test_db',
    };

    const getSpy = jest
      .spyOn(configService, 'get')
      .mockReturnValue(mockDbConfig);

    expect(service.config).toEqual(mockDbConfig);
    expect(getSpy).toHaveBeenCalledWith('database');
  });

  it('should throw error when config is missing', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => service.config).toThrow('Database configuration is missing');
  });
});
