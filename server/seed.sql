-- =============================================================================
-- FLASHBITES FOOD DELIVERY SEED DATA
-- =============================================================================

-- Seed Users (Customer, Restaurant Owner, Delivery Partner)
INSERT INTO users (id, name, email, password_hash, role, phone, lat, lng) VALUES
('11111111-1111-1111-1111-111111111111', 'Alex Rivera', 'alex@campus.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'CUSTOMER', '+1 (555) 234-5678', 12.9780, 77.6010),
('22222222-2222-2222-2222-222222222222', 'Chef Mario', 'mario@burgerhub.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'RESTAURANT', '+1 (555) 888-9999', 12.9720, 77.5950),
('33333333-3333-3333-3333-333333333333', 'Marcus Chen', 'marcus@drivers.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'DELIVERY_PARTNER', '+1 (555) 888-0101', 12.9722, 77.5952);

-- Seed Restaurants
INSERT INTO restaurants (id, owner_id, name, cuisine, rating, prep_time_mins, image_url, address, lat, lng) VALUES
('r1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Campus Burger Hub', 'American • Fast Food', 4.8, 15, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80', 'Student Union Quad, North Gate', 12.9720, 77.5950),
('r2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Artisan Pizza Express', 'Italian • Woodfired Pizza', 4.9, 20, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'Tech Block Plaza, Bay 4', 12.9740, 77.5910);

-- Seed Menu Items
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, image_url) VALUES
('m1111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 'Smokey Triple Cheeseburger', 'Angus beef patty, aged cheddar, caramelized onions, house secret sauce', 9.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'),
('m2222222-2222-2222-2222-222222222222', 'r1111111-1111-1111-1111-111111111111', 'Loaded Garlic Parmesan Fries', 'Skin-on fries tossed in white garlic butter and grated parmesan', 4.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80'),
('m3333333-3333-3333-3333-333333333333', 'r2222222-2222-2222-2222-222222222222', 'Margherita Supreme', 'San Marzano tomato sauce, fresh mozzarella di bufala, basil, olive oil', 12.99, 'Pizzas', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80');

-- Seed Sample Order
INSERT INTO orders (id, customer_id, restaurant_id, delivery_partner_id, status, total_amount, delivery_address) VALUES
('o1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', NULL, 'PLACED', 24.97, 'Dorm Block B, Room 402, Main Campus');

-- Seed Sample Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
('o1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 2, 9.99),
('o1111111-1111-1111-1111-111111111111', 'm2222222-2222-2222-2222-222222222222', 1, 4.99);
