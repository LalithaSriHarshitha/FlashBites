export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY_PARTNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantName?: string;
  cuisine?: string;
  address?: string;
}

export type OrderStatus = 
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface MenuItem {
  id: string;
  restaurantId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_veg: boolean;
  is_available: boolean;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  prepTime: string;
  image: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  menu: MenuItem[];
  owner_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  price_at_order: number;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_address: string;
  restaurant_id: string;
  restaurant_name?: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  driver_name?: string | null;
  driver_phone?: string | null;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
