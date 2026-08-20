-- =============================================================================
-- FLASHBITES VALID UUID CONTEST SEED DATA
-- =============================================================================

-- Seed Demo Users
INSERT INTO users (id, name, email, role, is_available) VALUES
('11111111-1111-1111-1111-111111111111', 'Alex Rivera (Customer)', 'customer@flashbites.com', 'CUSTOMER', true),
('22222222-2222-2222-2222-222222222222', 'Chef Mario (Restaurant)', 'restaurant@flashbites.com', 'RESTAURANT', true),
('33333333-3333-3333-3333-333333333333', 'Marcus Chen (Driver)', 'driver@flashbites.com', 'DELIVERY_PARTNER', true)
ON CONFLICT (email) DO NOTHING;

-- Seed 5 Restaurants with Valid UUIDs
INSERT INTO restaurants (id, owner_id, name, cuisine, image_url, address, lat, lng, rating) VALUES
('10000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Campus Burger Hub', 'American • Fast Food', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80', 'Student Union Quad, North Gate', 12.9720, 77.5950, 4.8),
('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Artisan Pizza Express', 'Italian • Woodfired Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'Tech Block Plaza, Bay 4', 12.9740, 77.5910, 4.9),
('30000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Tokyo Express Ramen', 'Japanese • Bowls & Noodles', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80', 'Library Walk Food Court', 12.9690, 77.5980, 4.7),
('40000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Spicy Tandoor Junction', 'North Indian • Biryani & Curry', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', 'Engineering Annex, Block C', 12.9755, 77.6005, 4.6),
('50000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Green Leaf Vegan Cafe', 'Healthy • Salads & Smoothies', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80', 'Science Complex Arcade', 12.9680, 77.5930, 4.8)
ON CONFLICT (id) DO NOTHING;

-- Seed Menu Items
INSERT INTO menu_items (restaurant_id, name, description, price, is_veg, is_available) VALUES
('10000000-0000-0000-0000-000000000001', 'Smokey Triple Cheeseburger', 'Angus beef patty, aged cheddar, sauce', 9.99, false, true),
('10000000-0000-0000-0000-000000000001', 'Crispy Buffalo Chicken Burger', 'Spicy fried chicken breast, ranch', 8.49, false, true),
('10000000-0000-0000-0000-000000000001', 'Loaded Garlic Parmesan Fries', 'Fries tossed in garlic butter', 4.99, true, true),
('10000000-0000-0000-0000-000000000001', 'Veggie Black Bean Burger', 'Plant-based patty with avocado', 7.99, true, true),
('10000000-0000-0000-0000-000000000001', 'Salted Caramel Gelato Shake', 'Hand-spun gelato shake', 3.99, true, true),
('10000000-0000-0000-0000-000000000001', 'Crispy Onion Rings (8pcs)', 'Panko crusted onion rings', 3.49, true, true),

('20000000-0000-0000-0000-000000000002', 'Margherita Supreme', 'San Marzano tomato sauce, mozzarella', 12.99, true, true),
('20000000-0000-0000-0000-000000000002', 'Double Pepperoni & Hot Honey', 'Cupping pepperoni, hot honey', 14.49, false, true),
('20000000-0000-0000-0000-000000000002', 'Truffle Wild Mushroom Pizza', 'Wild mushrooms, truffle cream', 15.99, true, true),
('20000000-0000-0000-0000-000000000002', 'Garlic Butter Crust Sticks', 'Woodfired breadsticks', 4.99, true, true),
('20000000-0000-0000-0000-000000000002', 'BBQ Chicken Pizza', 'Grilled chicken, BBQ sauce', 13.99, false, true),
('20000000-0000-0000-0000-000000000002', 'Traditional Italian Cannoli', 'Sweet ricotta pastry', 4.49, true, true);
