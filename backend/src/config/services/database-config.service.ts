import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../types/config.types';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get config(): DatabaseConfig {
    const config = this.configService.get<DatabaseConfig>('database');
    if (!config) {
      throw new Error('Database configuration is missing');
    }
    return config;
  }
}
