# Configuration Module

This module provides type-safe, validated configuration management for the Real-Time Order Tracking System.

## Features

- ✅ Environment variable validation using Joi schemas
- ✅ Type-safe configuration access
- ✅ Support for multiple environments (development, staging, production, test)
- ✅ Centralized configuration management
- ✅ Automatic validation on application startup

## Usage

### Accessing Configuration

```typescript
import { AppConfigService } from './config';

@Injectable()
export class YourService {
  constructor(private readonly configService: AppConfigService) {}

  someMethod() {
    // Access app configuration
    const port = this.configService.app.port;
    const environment = this.configService.app.nodeEnv;

    // Access database configuration
    const dbHost = this.configService.database.host;
    const dbPort = this.configService.database.port;

    // Environment helpers
    if (this.configService.isDevelopment()) {
      // Development-specific logic
    }
  }
}
```

### Configuration Categories

- **App**: Application-wide settings (port, environment, CORS, rate limiting)
- **Database**: PostgreSQL connection settings
- **JWT**: Authentication token configuration
- **Kafka**: Message queue settings
- **Elasticsearch**: Search engine configuration
- **Redis**: Cache and session storage settings

### Environment Variables

Copy `.env.example` to `.env` and configure your environment:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (minimum 32 characters each)
- `KAFKA_BROKERS`
- `ELASTICSEARCH_NODE`

## Validation

All environment variables are validated on startup using Joi schemas. Invalid configurations will prevent the application from starting with descriptive error messages.

## Testing

Mock the `AppConfigService` in your tests:

```typescript
{
  provide: AppConfigService,
  useValue: {
    app: { nodeEnv: 'test', port: 3000 },
    database: { host: 'localhost', port: 5432 },
    // ... other config sections
  },
}
```