import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_POOL_MIN: Joi.number().min(0).default(2),
  DATABASE_POOL_MAX: Joi.number().min(1).default(10),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Kafka
  KAFKA_BROKERS: Joi.string().required(),
  KAFKA_CLIENT_ID: Joi.string().default('realtime-order-tracking'),
  KAFKA_GROUP_ID: Joi.string().default('order-tracking-group'),
  KAFKA_RETRY_ATTEMPTS: Joi.number().min(0).default(3),
  KAFKA_RETRY_DELAY: Joi.number().min(0).default(1000),

  // Elasticsearch
  ELASTICSEARCH_NODE: Joi.string().uri().required(),
  ELASTICSEARCH_USERNAME: Joi.string().allow(''),
  ELASTICSEARCH_PASSWORD: Joi.string().allow(''),
  ELASTICSEARCH_INDEX_PREFIX: Joi.string().default('order-tracking'),

  // Redis (for caching and session management)
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow(''),
  REDIS_DB: Joi.number().min(0).default(0),

  // Monitoring
  ENABLE_PROMETHEUS: Joi.boolean().default(false),
  PROMETHEUS_PORT: Joi.number().port().default(9090),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),

  // API Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().min(0).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().min(1).default(100),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3001'),
  CORS_CREDENTIALS: Joi.boolean().default(true),
});
