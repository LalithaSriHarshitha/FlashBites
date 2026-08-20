-- ====================================================================
-- FLASHBITES ENTERPRISE LOW-LATENCY & HIGH-SCALABILITY DATABASE SCHEMA
-- Target PostgreSQL: Supabase Cloud PostgreSQL 15+
-- ====================================================================

-- 1. Create Role & Order Status Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CUSTOMER', 'RESTAURANT', 'DELIVERY_PARTNER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
      'PLACED', 'CONFIRMED', 'PREPARING', 
      'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 
      'DELIVERED', 'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  phone VARCHAR(20),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS restaurants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  owner_id UUID REFERENCES users(id),
  cuisine VARCHAR(100) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.5,
  prep_time VARCHAR(30) DEFAULT '15-20 mins',
  address TEXT NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(50) PRIMARY KEY,
  restaurant_id VARCHAR(50) REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_veg BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE (With Idempotency & High-Speed Indexing)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  restaurant_id VARCHAR(50) REFERENCES restaurants(id),
  delivery_partner_id UUID REFERENCES users(id),
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  restaurant_name VARCHAR(150),
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  delivery_address TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'PLACED',
  idempotency_key VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE (Child Line Items)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id VARCHAR(50) REFERENCES menu_items(id),
  name VARCHAR(150) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_order NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) GENERATED ALWAYS AS (quantity * price_at_order) STORED
);

-- 7. REALTIME DRIVER GPS TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS partner_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id),
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  speed_kmh NUMERIC(4,1) DEFAULT 25.0,
  battery_pct INTEGER DEFAULT 85,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER STATE AUDIT TRANSITION LOG
CREATE TABLE IF NOT EXISTS order_state_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  transitioned_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- HIGH-PERFORMANCE LOW-LATENCY INDEXES (Sub-Millisecond Execution)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_partner_locations_order_id ON partner_locations(order_id, created_at DESC);

-- Enable Supabase Realtime Replication for Live KDS & Driver Updates
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE partner_locations;
