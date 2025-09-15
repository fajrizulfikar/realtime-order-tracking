import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../types/config.types';

@Injectable()
export class KafkaConfigService {
  constructor(private configService: ConfigService) {}

  get config(): KafkaConfig {
    const config = this.configService.get<KafkaConfig>('kafka');
    if (!config) {
      throw new Error('Kafka configuration is missing');
    }
    return config;
  }
}
