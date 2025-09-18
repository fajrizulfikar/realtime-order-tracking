# Docker Setup Guide

This document provides instructions for running the Real-Time Order Tracking System using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for containers

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_PASSWORD`: PostgreSQL password
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Quick Start

### Development Environment

```bash
# Start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Infrastructure Only

```bash
# Start only database services (without app)
docker-compose up -d postgres redis kafka elasticsearch

# Useful for local development outside Docker
```

## Service Ports

| Service       | Port | URL                    |
|---------------|------|------------------------|
| Application   | 3000 | http://localhost:3000  |
| PostgreSQL    | 5432 | localhost:5432         |
| Redis         | 6379 | localhost:6379         |
| Kafka         | 9092 | localhost:9092         |
| Elasticsearch | 9200 | http://localhost:9200  |

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Application health endpoint
curl http://localhost:3000/health
```

## Production Considerations

- Resource limits are configured for production
- Persistent volumes for data storage
- Optimized JVM settings for Elasticsearch
- Security configurations applied

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports are not in use
2. **Memory issues**: Increase Docker memory limit
3. **Volume permissions**: Check file ownership

### Useful Commands

```bash
# Rebuild application image
docker-compose build app

# Clean up volumes (WARNING: deletes data)
docker-compose down -v

# View container resource usage
docker stats

# Access container shell
docker exec -it order-tracking-app-dev sh
```

## Architecture

The Docker setup includes:
- Multi-stage Dockerfile with Alpine images
- Separate dev/prod configurations
- Health checks for all services
- Resource limits and security hardening
- Persistent data volumes