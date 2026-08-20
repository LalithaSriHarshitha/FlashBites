/**
 * FLASHBITES BACKEND API SERVER
 * Express REST API + State Machine Lifecycle & Driver Telemetry Service
 */

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// In-Memory state fallback (can be swapped with pg pool connection)
let RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Campus Burger Hub',
    cuisine: 'American • Fast Food',
    rating: 4.8,
    prepTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80',
    lat: 12.9720,
    lng: 77.5950,
    menu: [
      { id: 'm1', name: 'Smokey Triple Cheeseburger', price: 9.99, description: 'Angus beef patty, aged cheddar', category: 'Burgers' },
      { id: 'm2', name: 'Loaded Garlic Parmesan Fries', price: 4.99, description: 'Skin-on fries tossed in garlic butter', category: 'Sides' }
    ]
  }
];

let ORDERS = [
  {
    id: 'ORD-9821',
    customerId: 'cust-1',
    customerName: 'Alex Rivera',
    customerPhone: '+1 (555) 234-5678',
    deliveryAddress: 'Dorm Block B, Room 402, Main Campus',
    restaurantId: 'rest-1',
    restaurantName: 'Campus Burger Hub',
    items: [
      { id: 'm1', name: 'Smokey Triple Cheeseburger', price: 9.99, quantity: 2 },
      { id: 'm2', name: 'Loaded Garlic Parmesan Fries', price: 4.99, quantity: 1 }
    ],
    totalAmount: 24.97,
    status: 'PLACED',
    placedAt: new Date().toLocaleTimeString(),
    driver: null,
    coordinates: { lat: 12.9720, lng: 77.5950 }
  }
];

let DRIVERS = [
  { id: 'drv-1', name: 'Marcus Chen', vehicle: 'Eco e-Bike', phone: '+1 555-888-01', rating: 4.9, lat: 12.9722, lng: 77.5952 }
];

let NOTIFICATIONS = [];

// Order lifecycle valid state transition graph
const VALID_TRANSITIONS = {
  'PLACED': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['PREPARING', 'CANCELLED'],
  'PREPARING': ['READY_FOR_PICKUP'],
  'READY_FOR_PICKUP': ['PICKED_UP'],
  'PICKED_UP': ['OUT_FOR_DELIVERY'],
  'OUT_FOR_DELIVERY': ['DELIVERED'],
  'DELIVERED': [],
  'CANCELLED': []
};

// 1. Get All Restaurants & Menus
app.get('/api/restaurants', (req, res) => {
  res.json({ success: true, data: RESTAURANTS });
});

// 2. Place Order
app.post('/api/orders', (req, res) => {
  const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: 'cust-1',
    customerName: 'Alex Rivera',
    customerPhone: '+1 (555) 234-5678',
    deliveryAddress: deliveryAddress || 'Campus Dorm Block B',
    restaurantId,
    restaurantName: restaurant ? restaurant.name : 'Campus Food',
    items,
    totalAmount,
    status: 'PLACED',
    placedAt: new Date().toLocaleTimeString(),
    driver: null,
    coordinates: { lat: restaurant?.lat || 12.9720, lng: restaurant?.lng || 77.5950 }
  };

  ORDERS.unshift(newOrder);
  NOTIFICATIONS.unshift({ id: Date.now(), title: 'Order Placed', message: `Order #${newOrder.id} placed successfully.` });

  res.status(201).json({ success: true, data: newOrder });
});

// 3. Get All Orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: ORDERS });
});

// 4. Update Order Status (With State Machine validation & Driver Auto-Assignment)
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  const order = ORDERS.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const allowedNext = VALID_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      error: `Invalid state transition from ${order.status} to ${newStatus}. Allowed transitions: ${allowedNext.join(', ')}`
    });
  }

  order.status = newStatus;

  // Auto assign driver when status moves to READY_FOR_PICKUP
  if (newStatus === 'READY_FOR_PICKUP' && !order.driver) {
    order.driver = DRIVERS[0]; // Auto assign closest driver
    NOTIFICATIONS.unshift({
      id: Date.now(),
      title: 'Driver Assigned',
      message: `Driver ${DRIVERS[0].name} assigned to Order #${order.id}`
    });
  }

  NOTIFICATIONS.unshift({
    id: Date.now(),
    title: 'Order Status Update',
    message: `Order #${order.id} is now ${newStatus.replace(/_/g, ' ')}`
  });

  res.json({ success: true, data: order });
});

// 5. Cancel Order Endpoint (Guarded to PLACED or CONFIRMED)
app.post('/api/orders/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = ORDERS.find(o => o.id === id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  if (!['PLACED', 'CONFIRMED'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      error: 'Order cannot be cancelled because kitchen preparation has already begun.'
    });
  }

  order.status = 'CANCELLED';
  order.cancellation_reason = reason || 'Cancelled by customer';
  NOTIFICATIONS.unshift({ id: Date.now(), title: 'Order Cancelled', message: `Order #${order.id} cancelled. Refund issued.` });

  res.json({ success: true, data: order });
});

// 6. Driver Live GPS Location Update Telemetry
app.post('/api/orders/:id/location', (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;

  const order = ORDERS.find(o => o.id === id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  order.coordinates = { lat, lng };
  res.json({ success: true, data: order.coordinates });
});

// 7. Get Notifications
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: NOTIFICATIONS });
});

app.listen(PORT, () => {
  console.log(`⚡ FlashBites Express API server listening on http://localhost:${PORT}`);
});
