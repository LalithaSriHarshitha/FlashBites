# 🗺️ Real-Time Maps & GPS Telemetry Implementation Guide

This guide details how real-time live map tracking and driver GPS location broadcasting work in **FlashBites** using **Leaflet + OpenStreetMap + HTML5 Geolocation API + Supabase Realtime WebSockets**.

---

## 🏗️ Architecture Overview

```
[Driver Mobile Device]
       │
       ▼ (1) HTML5 navigator.geolocation.watchPosition()
[Latitude / Longitude Coordinates]
       │
       ▼ (2) HTTP POST / Supabase Table Insert
[partner_locations Table in PostgreSQL]
       │
       ▼ (3) Supabase Realtime WebSocket Event ("INSERT")
[Customer React Frontend]
       │
       ▼ (4) Leaflet.js / OpenStreetMap Map Canvas Rerender
[Moving Marker & Polyline Tracked Live!]
```

---

## 1️⃣ Step 1: Add Leaflet & OpenStreetMap to Frontend

Install Leaflet and its TypeScript definitions:

```bash
npm install leaflet @types/leaflet
```

Import Leaflet CSS in your `index.html` or `index.css`:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

---

## 2️⃣ Step 2: Driver Mobile Device GPS Telemetry Broadcast

In the **Delivery Partner Dashboard**, use the browser's native `navigator.geolocation.watchPosition` API to track the driver's movement as they ride:

```typescript
// Driver Dashboard: Broadcast live location every time the driver moves
export function startDriverGPSTracking(orderId: string, partnerId: string) {
  if (!('geolocation' in navigator)) {
    console.error('Geolocation API not supported on this browser.');
    return;
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`📍 Driver GPS Updated: ${latitude}, ${longitude}`);

      // Insert new location pin into Supabase
      await supabase.from('partner_locations').insert({
        order_id: orderId,
        partner_id: partnerId,
        lat: latitude,
        lng: longitude,
        updated_at: new Date().toISOString()
      });
    },
    (error) => console.error('GPS Telemetry Error:', error),
    {
      enableHighAccuracy: true, // Uses real GPS hardware on mobile devices
      maximumAge: 1000,         // Refresh every 1 second
      timeout: 5000
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
```

---

## 3️⃣ Step 3: Supabase Realtime WebSocket Subscription

In the **Customer Dashboard**, subscribe to live coordinates inserted into `partner_locations`:

```typescript
// Customer Dashboard: Receive driver location stream
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useDriverLiveLocation(orderId: string) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // Create real-time channel
    const channel = supabase
      .channel(`live-gps-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'partner_locations',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('⚡ New Driver Location Received via WebSocket:', payload.new);
          setCoords({ lat: payload.new.lat, lng: payload.new.lng });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return coords;
}
```

---

## 4️⃣ Step 4: Rendering Leaflet Map Canvas with Moving Driver Pin

Render Leaflet tiles using free OpenStreetMap layers (no paid API key required):

```tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface RealtimeMapProps {
  restaurantCoords: { lat: number; lng: number };
  customerCoords: { lat: number; lng: number };
  driverCoords?: { lat: number; lng: number } | null;
}

export default function RealtimeMap({ restaurantCoords, customerCoords, driverCoords }: RealtimeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [restaurantCoords.lat, restaurantCoords.lng],
        14
      );

      // 2. OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // 3. Restaurant Pin Marker (Amber)
      L.marker([restaurantCoords.lat, restaurantCoords.lng])
        .addTo(map)
        .bindPopup('🍳 Kitchen Pickup');

      // 4. Customer Pin Marker (Rose)
      L.marker([customerCoords.lat, customerCoords.lng])
        .addTo(map)
        .bindPopup('👤 Dropoff Destination');

      mapInstanceRef.current = map;
    }

    // 5. Update Moving Driver Pin Marker smoothly
    if (driverCoords && mapInstanceRef.current) {
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker([driverCoords.lat, driverCoords.lng], {
          icon: L.divIcon({
            className: 'driver-marker-pin',
            html: '<div style="background:#059669;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.3);">🛵</div>'
          })
        }).addTo(mapInstanceRef.current);
      } else {
        // Smoothly animate marker to new GPS coordinates
        driverMarkerRef.current.setLatLng([driverCoords.lat, driverCoords.lng]);
        mapInstanceRef.current.panTo([driverCoords.lat, driverCoords.lng]);
      }
    }
  }, [restaurantCoords, customerCoords, driverCoords]);

  return <div ref={mapContainerRef} className="w-full h-64 rounded-2xl border border-slate-200" />;
}
```

---

## 💡 Summary & Best Practices

1. **Zero API Key Cost**: OpenStreetMap tiles are 100% free and open-source.
2. **Battery Optimization**: Set `maximumAge: 1000` and `timeout: 5000` so mobile devices don't overheat or drain battery excessively.
3. **Fallback Simulation**: If GPS signal is lost or denied by the browser, fallback to distance-based interpolation between the restaurant coordinates and customer address coordinates.
