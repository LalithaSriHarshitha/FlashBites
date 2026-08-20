# 🔒 Enterprise Security & Multi-Category Authentication Specification

**Project**: FlashBites Multi-Role System Architecture  
**Document Version**: 3.0  

---

## 1. Role-Based Access Control (RBAC) Matrix

| User Category | Portal Access | Permissions & Scopes | Data Isolation Policy |
|---|---|---|---|
| 👤 **Customer** (`CUSTOMER`) | Customer Storefront | Search restaurants, filter veg/non-veg, add items to cart, checkout orders, track active delivery GPS telemetry, cancel pending orders (`PLACED`/`CONFIRMED`). | Can ONLY view orders where `customer_id = auth.uid()`. |
| 🍳 **Restaurant Kitchen** (`RESTAURANT`) | Kitchen Display System (KDS) | View incoming order queue, accept/confirm orders, trigger cooking status (`PREPARING`), mark ready for pickup, toggle menu item availability (`In Stock`/`Out of Stock`), modify dish prices. | Can ONLY view & modify orders and menu items where `restaurant_id = user.restaurant_id`. |
| 🛵 **Delivery Partner** (`DELIVERY_PARTNER`) | Driver Dispatch System | Toggle availability status (`Online`/`Offline`), view ready pickup tasks, confirm food pickup, broadcast live GPS coordinates, mark order delivered. | Can ONLY view & update orders assigned to `delivery_partner_id = auth.uid()`. |
| 🛡️ **Administrator** (`ADMIN`) | System Admin Console | Full platform read/write access across all eateries, orders, telemetry streams, and users. | Global override privileges (`USING (true)`). |

---

## 2. JWT Session Token Structure & Claims Specification

The frontend generates and validates JSON Web Tokens (JWT) signed using HMAC SHA-256 containing role-scoped claims:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "sub": "11111111-1111-1111-1111-111111111111",
  "name": "Alex Rivera (Customer)",
  "email": "customer@flashbites.com",
  "role": "CUSTOMER",
  "iat": 1770895200,
  "exp": 1770981600
}
```

---

## 3. PostgreSQL Row Level Security (RLS) Policies

Supabase enforces database-level authorization via Row Level Security:

```sql
-- 1. Customers can view ONLY their own orders
CREATE POLICY "Customer Orders Isolation" ON orders
  FOR SELECT USING (auth.uid() = customer_id OR auth.jwt() ->> 'role' = 'ADMIN');

-- 2. Restaurant owners can update ONLY their own menu items
CREATE POLICY "Restaurant Owner Menu Scope" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- 3. Delivery Partners can update ONLY assigned active deliveries
CREATE POLICY "Driver Assigned Delivery Scope" ON orders
  FOR UPDATE USING (auth.uid() = delivery_partner_id);
```

---

## 4. Frontend Route Guard Integration

```tsx
<AuthProvider>
  <ProtectedRoute allowedRoles={['CUSTOMER']}>
    <CustomerDashboard />
  </ProtectedRoute>
</AuthProvider>
```
