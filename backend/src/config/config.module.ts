import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import {
  AppConfigService,
  DatabaseConfigService,
  JwtConfigService,
  KafkaConfigService,
  ElasticsearchConfigService,
  RedisConfigService,
} from './services';
import { configurations } from './configuration';
import { envValidationSchema } from './env.validation';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  providers: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    KafkaConfigService,
    ElasticsearchConfigService,
    RedisConfigService,
  ],
  exports: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    KafkaConfigService,
    ElasticsearchConfigService,
    RedisConfigService,
  ],
})
export class AppConfigModule {}
