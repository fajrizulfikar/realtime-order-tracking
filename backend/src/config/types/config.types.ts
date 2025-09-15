export interface AppConfig {
  nodeEnv: string;
  port: number;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
  corsCredentials: boolean;
  enablePrometheus: boolean;
  prometheusPort: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  retryAttempts: number;
  retryDelay: number;
}

export interface ElasticsearchConfig {
  node: string;
  username: string;
  password: string;
  indexPrefix: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}
