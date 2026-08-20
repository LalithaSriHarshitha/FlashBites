import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';

export interface PlaceOrderPayload {
  restaurant: any;
  items: any[];
  totalAmount: number;
  deliveryAddress: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
}

class OrderService {
  private inMemoryCache: Map<string, Order> = new Map();

  async placeOrder(payload: PlaceOrderPayload): Promise<Order> {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const safeRestaurant = payload.restaurant || {
      id: 'rest-udipi',
      name: 'Sri Udipi Grand',
      location: { lat: 16.3070, lng: 80.4370 }
    };

    const safeItems = Array.isArray(payload.items) ? payload.items : [];

    const orderObj: Order = {
      id: orderId,
      customer_id: payload.customerId || 'usr-c-1',
      customer_name: payload.customerName || 'Anand Kumar',
      customer_phone: payload.customerPhone || '+91 98765 43210',
      delivery_address: payload.deliveryAddress || 'Brodipet 5th Line, Guntur City, AP 522002',
      restaurant_id: safeRestaurant.id || 'rest-udipi',
      restaurant_name: safeRestaurant.name || 'Sri Udipi Grand',
      items: safeItems.map((i) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        order_id: orderId,
        menu_item_id: i.id || 'm-1',
        name: i.name || 'Dish Item',
        quantity: i.quantity || 1,
        price_at_order: i.price || 100
      })),
      total_amount: payload.totalAmount || 100,
      status: 'PLACED',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      driver_name: null,
      driver_phone: null,
      coordinates: {
        lat: safeRestaurant.location?.lat || 16.3070,
        lng: safeRestaurant.location?.lng || 80.4370
      }
    };

    // 1. Instant Optimistic Memory Store (< 10ms response)
    this.inMemoryCache.set(orderId, orderObj);

    // 2. Asynchronous PostgreSQL Persistence Loop
    this.persistToDatabase(orderObj, idempotencyKey, safeItems).catch((err) =>
      console.warn('PostgreSQL Async Persist Notice (Fallback to Local State Active):', err)
    );

    return orderObj;
  }

  private async persistToDatabase(order: Order, idempotencyKey: string, rawItems: any[]) {
    try {
      const { error: orderErr } = await supabase
        .from('orders')
        .insert({
          id: order.id,
          customer_id: order.customer_id,
          restaurant_id: order.restaurant_id,
          restaurant_name: order.restaurant_name,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          delivery_address: order.delivery_address,
          total_amount: order.total_amount,
          status: 'PLACED',
          idempotency_key: idempotencyKey,
          created_at: new Date().toISOString()
        });

      if (orderErr) throw orderErr;

      const orderItems = (rawItems || []).map((item) => ({
        order_id: order.id,
        menu_item_id: item.id || 'm-1',
        name: item.name || 'Dish Item',
        quantity: item.quantity || 1,
        price_at_order: item.price || 100
      }));

      await supabase.from('order_items').insert(orderItems);

      const channel = supabase.channel('order_events');
      channel.send({
        type: 'broadcast',
        event: 'NEW_ORDER_PLACED',
        payload: { orderId: order.id, restaurantId: order.restaurant_id, total: order.total_amount }
      });

    } catch (error) {
      console.warn('Supabase DB Async Sync Notice:', error);
    }
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, driverInfo?: { name: string; phone: string }) {
    const cachedOrder = this.inMemoryCache.get(orderId);
    if (cachedOrder) {
      cachedOrder.status = newStatus;
      if (driverInfo) {
        cachedOrder.driver_name = driverInfo.name;
        cachedOrder.driver_phone = driverInfo.phone;
      }
      cachedOrder.updated_at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    try {
      await supabase
        .from('orders')
        .update({
          status: newStatus,
          driver_name: driverInfo?.name || null,
          driver_phone: driverInfo?.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
    } catch (err) {
      console.warn('Async DB status update notice:', err);
    }
  }
}

export const orderService = new OrderService();
