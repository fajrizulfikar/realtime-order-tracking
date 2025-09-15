import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../types/config.types';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get config(): JwtConfig {
    const config = this.configService.get<JwtConfig>('jwt');
    if (!config) {
      throw new Error('JWT configuration is missing');
    }
    return config;
  }
}
