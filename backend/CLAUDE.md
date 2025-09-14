# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses pnpm as the package manager:

```bash
# Install dependencies
pnpm install

# Development server (with watch mode)
pnpm run start:dev

# Production build and run
pnpm run build
pnpm run start:prod

# Code quality
pnpm run lint          # ESLint with auto-fix
pnpm run format        # Prettier formatting

# Testing
pnpm run test          # Unit tests
pnpm run test:watch    # Unit tests in watch mode
pnpm run test:cov      # Test coverage
pnpm run test:e2e      # End-to-end tests
```

## Architecture Overview

This is a **Real-Time Order Tracking System** backend built with NestJS. The system design is documented in `../docs/SDD.md` which defines a comprehensive architecture including:

### Current State
- Basic NestJS starter template with minimal functionality
- Standard MVC structure: `app.controller.ts`, `app.service.ts`, `app.module.ts`
- Configured with ESLint, Prettier, and Jest testing framework

### Target Architecture (per SDD.md)
- **REST API** with JWT authentication and role-based access control (CUSTOMER/ADMIN roles)
- **WebSocket Gateway** for real-time order updates on `/orders` namespace
- **Kafka Integration** as producer/consumer for event-driven messaging
- **Database Layer**: PostgreSQL for transactional data, Elasticsearch for analytics
- **Message Queue**: Kafka topics for order lifecycle events (`order.created`, `order.updated`, etc.)
- **Monitoring**: Prometheus metrics and structured JSON logging

### Key Implementation Areas
1. **Database Models**: PostgreSQL entities for Order and User with UUID primary keys
2. **Authentication System**: JWT-based auth with role-based permissions
3. **Order Management API**: Complete CRUD operations for orders
4. **Real-time Communication**: WebSocket integration for live status updates
5. **Event-Driven Architecture**: Kafka producer/consumer patterns
6. **Search & Analytics**: Elasticsearch integration for flexible queries

## Project Structure

```
src/
├── main.ts           # Application bootstrap (port 3000 default)
├── app.module.ts     # Root application module
├── app.controller.ts # Basic controller (to be extended)
└── app.service.ts    # Basic service (to be extended)
```

## Key Dependencies to Add

Based on the SDD requirements, the following major dependencies need to be added:
- Database: PostgreSQL driver (pg), TypeORM or Prisma
- Messaging: KafkaJS or @nestjs/kafka
- WebSockets: @nestjs/websockets, socket.io
- Authentication: @nestjs/jwt, @nestjs/passport
- Search: @elastic/elasticsearch
- Monitoring: Prometheus client libraries

## Development Notes

- Uses TypeScript with strict configuration
- ESLint configured with TypeScript and Prettier integration
- Jest configured for both unit and e2e testing
- Source files should follow NestJS conventions (modules, controllers, services)
- Port defaults to 3000 but respects PORT environment variable

## Coding Principle
*ALWAYS* use this principle everytime you generate a code:
1. KISS
2. DRY
3. Don't write more than 100 line. When reach more than 100 line, refactor!
4. Flatten any complex if/else condition
5. Declarative rather than imperative
6. Use SOLID principle whenever possible