import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
    10,
  ),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  enablePrometheus: process.env.ENABLE_PROMETHEUS === 'true',
  prometheusPort: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
}));
