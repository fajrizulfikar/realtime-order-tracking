import { ConfigFactory } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import kafkaConfig from './kafka.config';
import elasticsearchConfig from './elasticsearch.config';
import redisConfig from './redis.config';

export const configurations: ConfigFactory[] = [
  appConfig,
  databaseConfig,
  jwtConfig,
  kafkaConfig,
  elasticsearchConfig,
  redisConfig,
];

export {
  appConfig,
  databaseConfig,
  jwtConfig,
  kafkaConfig,
  elasticsearchConfig,
  redisConfig,
};
