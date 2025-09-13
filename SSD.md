System Design Document (SDD)
Project: Real-Time Order Tracking System
Date: September 13, 2025

1. System Overview
The Real-Time Order Tracking System allows users to place, track, and update orders with sub-second latency. It is powered by a NestJS backend, Kafka for distributed messaging, a relational database for transactional integrity, and Elasticsearch for flexible queries and analytics.

2. High-Level Architecture
Core Components
Frontend UI

Customer dashboard: order placement and tracking.

Admin dashboard: monitoring all orders and analytics.

Backend (NestJS)

REST API for order management.

WebSocket Gateway for real-time pushes.

Kafka producer/consumer integration.

Messaging Layer (Kafka)

Publishes and broadcasts all order lifecycle events.

Databases

PostgreSQL (master transactional store).

Elasticsearch (secondary store for query & analytics).

Monitoring

Prometheus + Grafana dashboards.

ELK for logs.

3. Data Model
Order Entity (PostgreSQL)
text
Order {
  id: UUID (PK)
  user_id: UUID (FK -> User)
  status: ENUM('CREATED','ACCEPTED','PREPARED','SHIPPED','DELIVERED','CANCELED')
  items: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
User Entity
text
User {
  id: UUID (PK)
  name: VARCHAR
  email: VARCHAR (unique)
  role: ENUM('CUSTOMER','ADMIN')
  created_at: TIMESTAMP
}
Kafka Event Schema (Avro/JSON example)
json
{
  "orderId": "UUID",
  "userId": "UUID",
  "status": "CREATED",
  "timestamp": "2025-09-13T16:43:00Z",
  "payload": {
    "items": [
      { "productId": "A123", "qty": 2 }
    ]
  }
}
4. Kafka Topology
Topics
order.created

order.updated

order.completed

order.canceled

Producers
NestJS backend on order actions.

Consumers
WebSocket gateway (fanout to connected clients).

Elasticsearch consumer (persists historical view).

Analytics engine (optional future extension).

Partition Strategy
Partition by OrderID to ensure ordering of messages belonging to the same order.

5. Elasticsearch Schema
Each Kafka event is indexed in Elasticsearch with the following mapping:

json
{
  "mappings": {
    "properties": {
      "orderId": { "type": "keyword" },
      "userId": { "type": "keyword" },
      "status": { "type": "keyword" },
      "timestamp": { "type": "date" },
      "items": { "type": "nested" }
    }
  }
}
Queries supported:

Filter by order ID or status.

Range queries by timestamp.

Aggregations by status count, daily trend, busiest period.

6. API Design (NestJS)
Authentication
JWT with roles (CUSTOMER, ADMIN).

REST Endpoints
Orders
POST /orders → Place new order

GET /orders/:id → Fetch order by ID (live status)

GET /orders/user/:id → Fetch all orders for user

PATCH /orders/:id/status → Update order status (Admin)

Search (backed by Elasticsearch)
GET /search/orders?status=DELIVERED&from=2025-09-01&to=2025-09-13

GET /search/orders/:id/history → Retrieve all status changes for given order

WebSockets
Namespace: /orders

Event: order.updated → Push order lifecycle updates in real time.

7. Sequence Flows
Use Case: Place Order
Customer dashboard calls POST /orders.

NestJS backend writes order to PostgreSQL.

Backend emits order.created event to Kafka.

Kafka:

WebSocket Gateway pushes update to customer session.

Elasticsearch consumer indexes order event.

Use Case: Order Update
Admin updates status with PATCH /orders/:id/status.

Backend updates PostgreSQL.

Backend emits order.updated to Kafka.

Kafka pushes event → WebSocket Gateway + Elasticsearch.

8. Scalability Considerations
Kafka scaling: Increase partitions based on throughput, ensure ordering by partition key = orderId.

Database scaling:

PostgreSQL read replicas for scaling reads.

Write-heavy load handled by partitioned tables.

Elasticsearch scaling:

Multi-shard setup for historical queries.

Use ILM (Index Lifecycle Management) for archiving older data.

API scaling:

Horizontal NestJS scaling with stateless services behind load balancers.

Client connections:

WebSocket server with clustering and Redis pub-sub for scaling.

9. Security & Compliance
Access control: Role-based (JWT).

Data encryption: TLS in transit, AES-256 at rest.

Auditing: All write operations logged into Kafka for immutable audit history.

Rate limiting: API Gateway-level protection.

10. Monitoring and Observability
Logging: JSON logs pushed to ELK stack.

Metrics: Prometheus metrics from NestJS + Kafka + PostgreSQL.

Dashboards: Grafana for event throughput, order latency, error rates.

Alerts: On message lag in Kafka, DB slow queries, Elasticsearch query latency.

11. Future Extensions
Integrate machine learning anomaly detection for delayed/canceled orders.

Support multitenancy for B2B clients.

Add payment system integration with idempotent event handling.

Enable geo-tracking of delivery drivers with Kafka streaming enrichment.