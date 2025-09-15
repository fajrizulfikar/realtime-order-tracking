import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '../types/config.types';

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get config(): RedisConfig {
    const config = this.configService.get<RedisConfig>('redis');
    if (!config) {
      throw new Error('Redis configuration is missing');
    }
    return config;
  }
}
