import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  brokers: process.env.KAFKA_BROKERS?.split(',') || [],
  clientId: process.env.KAFKA_CLIENT_ID || 'realtime-order-tracking',
  groupId: process.env.KAFKA_GROUP_ID || 'order-tracking-group',
  retryAttempts: parseInt(process.env.KAFKA_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.KAFKA_RETRY_DELAY || '1000', 10),
}));
