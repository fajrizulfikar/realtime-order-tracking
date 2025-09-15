import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchConfig } from '../types/config.types';

@Injectable()
export class ElasticsearchConfigService {
  constructor(private configService: ConfigService) {}

  get config(): ElasticsearchConfig {
    const config = this.configService.get<ElasticsearchConfig>('elasticsearch');
    if (!config) {
      throw new Error('Elasticsearch configuration is missing');
    }
    return config;
  }
}
