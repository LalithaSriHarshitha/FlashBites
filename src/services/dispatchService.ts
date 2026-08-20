import { supabase } from '../lib/supabase';
import { DRIVERS } from '../data/mockData';

export interface NearbyDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  distanceKm: number;
  location: { lat: number; lng: number };
}

class DispatchService {
  /**
   * Haversine Geodesic Distance Formula (Calculates distance between 2 GPS coordinates in km)
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Find all online delivery partners within a 5 km radius of the restaurant
   */
  findNearbyDrivers(kitchenLat: number, kitchenLng: number, maxRadiusKm: number = 5.0): NearbyDriver[] {
    return DRIVERS.map((driver) => {
      const dist = this.calculateDistanceKm(
        kitchenLat,
        kitchenLng,
        driver.location.lat,
        driver.location.lng
      );
      return {
        ...driver,
        distanceKm: dist
      };
    })
      .filter((driver) => driver.distanceKm <= maxRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  /**
   * Broadcast high-priority dispatch notification to nearby driver consoles
   */
  async notifyNearbyDrivers(orderId: string, restaurantName: string, kitchenLat: number, kitchenLng: number, totalAmount: number) {
    const nearby = this.findNearbyDrivers(kitchenLat, kitchenLng, 5.0);

    const dispatchPayload = {
      type: 'broadcast',
      event: 'DRIVER_DISPATCH_ALERT',
      payload: {
        orderId,
        restaurantName,
        kitchenCoords: { lat: kitchenLat, lng: kitchenLng },
        nearbyDriversCount: nearby.length,
        earnings: Math.round(totalAmount * 0.15 + 40), // Delivery fee earnings calculation
        timestamp: new Date().toLocaleTimeString()
      }
    };

    // Send WebSocket notification over Supabase Realtime channel
    const channel = supabase.channel('driver_dispatch');
    channel.send(dispatchPayload);

    return {
      notifiedDriversCount: nearby.length,
      closestDriver: nearby[0] || null,
      nearbyList: nearby
    };
  }
}

export const dispatchService = new DispatchService();
