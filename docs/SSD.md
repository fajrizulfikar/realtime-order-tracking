# System Design Document (SDD)

**Project:** Real-Time Order Tracking System  
**Date:** September 13, 2025  

---

## 1. System Overview
The Real-Time Order Tracking System allows users to place, track, and update orders with sub-second latency.  
It is powered by a **NestJS backend**, **Kafka** for distributed messaging, a **relational database** for transactional integrity, and **Elasticsearch** for flexible queries and analytics.

---

## 2. High-Level Architecture

### Core Components

- **Frontend UI**
  - Customer dashboard: order placement and tracking  
  - Admin dashboard: monitoring all orders and analytics  

- **Backend (NestJS)**
  - REST API for order management  
  - WebSocket Gateway for real-time pushes  
  - Kafka producer/consumer integration  

- **Messaging Layer (Kafka)**
  - Publishes and broadcasts all order lifecycle events  

- **Databases**
  - PostgreSQL (master transactional store)  
  - Elasticsearch (secondary store for query & analytics)  

- **Monitoring**
  - Prometheus + Grafana dashboards  
  - ELK for logs  

---

## 3. Data Model

### Order Entity (PostgreSQL)
```text
Order {
  id: UUID (PK)
  user_id: UUID (FK -> User)
  status: ENUM('CREATED','ACCEPTED','PREPARED','SHIPPED','DELIVERED','CANCELED')
  items: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### User Entity
```text
User {
  id: UUID (PK)
  name: VARCHAR
  email: VARCHAR (unique)
  role: ENUM('CUSTOMER','ADMIN')
  created_at: TIMESTAMP
}
```

### Kafka Event Schema (Avro/JSON Example)
```json
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
```

---

## 4. Kafka Topology

**Topics:**
- `order.created`  
- `order.updated`  
- `order.completed`  
- `order.canceled`  

**Producers:**
- NestJS backend on order actions  

**Consumers:**
- WebSocket gateway (fanout to connected clients)  
- Elasticsearch consumer (persists historical view)  
- Analytics engine (optional future extension)  

**Partition Strategy:**
- Partition by `OrderID` to ensure ordering of messages belonging to the same order  

---

## 5. Elasticsearch Schema

Each Kafka event is indexed in Elasticsearch with the following mapping:

```json
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
```

**Supported Queries:**
- Filter by order ID or status  
- Range queries by timestamp  
- Aggregations by status count, daily trend, busiest period  

---

## 6. API Design (NestJS)

### Authentication
- JWT with roles (**CUSTOMER**, **ADMIN**)  

### REST Endpoints

| Endpoint                | Method | Role     | Description                              |
|--------------------------|--------|----------|------------------------------------------|
| `/orders`               | POST   | Customer | Place new order                          |
| `/orders/:id`           | GET    | Any      | Fetch order by ID (live status)          |
| `/orders/user/:id`      | GET    | Customer | Fetch all orders for user                |
| `/orders/:id/status`    | PATCH  | Admin    | Update order status                      |
| `/search/orders`        | GET    | Admin    | Search historical orders by filters      |
| `/search/orders/:id/history` | GET | Any | Retrieve all status changes for order |

### WebSockets
- **Namespace:** `/orders`  
- **Event:** `order.updated`  
- Push order lifecycle updates in real time.  

---

## 7. Sequence Flows

### Use Case: Place Order
1. Customer dashboard calls `POST /orders`  
2. NestJS backend writes order to PostgreSQL  
3. Backend emits `order.created` event to Kafka  
4. Kafka:  
   - WebSocket Gateway pushes update to customer session  
   - Elasticsearch consumer indexes order event  

### Use Case: Order Update
1. Admin updates status with `PATCH /orders/:id/status`  
2. Backend updates PostgreSQL  
3. Backend emits `order.updated` to Kafka  
4. Kafka pushes event → WebSocket Gateway + Elasticsearch  

---

## 8. Scalability Considerations

- **Kafka scaling:** Increase partitions based on throughput, ensure ordering by partition key = `orderId`  
- **Database scaling:**
  - PostgreSQL read replicas for scaling reads  
  - Write-heavy load handled by partitioned tables  
- **Elasticsearch scaling:**
  - Multi-shard setup for historical queries  
  - Use ILM (Index Lifecycle Management) for archiving older data  
- **API scaling:** Horizontal NestJS scaling with stateless services behind load balancers  
- **Client connections:** WebSocket server with clustering and Redis pub-sub for scaling  

---

## 9. Security & Compliance

- Access control: Role-based (JWT)  
- Data encryption: TLS in transit, AES-256 at rest  
- Auditing: All write operations logged into Kafka for immutable audit history  
- Rate limiting: API Gateway-level protection  

---

## 10. Monitoring and Observability

- **Logging:** JSON logs pushed to ELK stack  
- **Metrics:** Prometheus metrics from NestJS + Kafka + PostgreSQL  
- **Dashboards:** Grafana for event throughput, order latency, error rates  
- **Alerts:** On message lag in Kafka, DB slow queries, Elasticsearch query latency  

---

## 11. Future Extensions

- Integrate machine learning anomaly detection for delayed/canceled orders  
- Support multitenancy for B2B clients  
- Add payment system integration with idempotent event handling  
- Enable geo-tracking of delivery drivers with Kafka streaming enrichment  
