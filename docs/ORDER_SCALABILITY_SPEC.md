# ⚡ Next-Level Low-Latency & High-Scalability Order Engine

**Project**: FlashBites System Architecture Engine  
**Version**: 4.0  

---

## 1. High-Scalability Architecture Overview

```
 [ Customer Frontend ]
          │
          │ 1. Place Order Request (< 10ms UI render)
          ▼
 ┌───────────────────────────────────────────────────────────┐
 │               In-Memory Cache (Map<ID, Order>)            │
 └────────────────────────────┬──────────────────────────────┘
                              │
                              │ 2. Async Non-Blocking Write
                              ▼
 ┌───────────────────────────────────────────────────────────┐
 │       OrderService (Idempotency Key Generation)           │
 └──────────────┬────────────────────────────┬───────────────┘
                │                            │
                │ 3. Supabase REST API       │ 4. WebSocket Broadcast
                ▼                            ▼
 ┌──────────────────────────┐    ┌───────────────────────────┐
 │ PostgreSQL Database      │    │ Kitchen KDS & Driver      │
 │ (`orders`, `order_items`)│    │ Live WebSocket Stream     │
 └──────────────────────────┘    └───────────────────────────┘
```

---

## 2. Low-Latency Performance Optimizations

1. **Optimistic In-Memory Cache**:
   - Order creation updates UI state in `< 10ms` before waiting for database network roundtrips.
2. **Idempotency Key Enforcement**:
   - `idempotency_key = "idemp_${timestamp}_${random}"` attached to every payload prevents duplicate orders under high traffic or retries.
3. **Database Indexing Matrix**:
   - `idx_orders_status`: B-Tree index on `orders(status)` for instant Kitchen queue filtering.
   - `idx_orders_customer`: B-Tree index on `orders(customer_id)` for sub-millisecond customer order retrieval.
   - `idx_partner_locations_order_id`: Composite index on `partner_locations(order_id, created_at DESC)` for high-frequency 1.5s driver GPS telemetry streaming.
4. **PostgreSQL Realtime WAL Replication**:
   - `ALTER PUBLICATION supabase_realtime ADD TABLE orders;` broadcasts status transitions (`PLACED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY_FOR_PICKUP`) across all connected devices via WebSockets.
