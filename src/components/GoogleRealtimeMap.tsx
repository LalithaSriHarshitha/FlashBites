import React, { useEffect, useRef, useState } from 'react';
import { Radio, Bike, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { geolocationService } from '../services/geolocationService';
import RealtimeDistanceMeter from './RealtimeDistanceMeter';
import { Order } from '../types';

interface GoogleRealtimeMapProps {
  order: Order | null;
}

// GUNTUR CITY CENTER DEFAULT COORDINATES
const GUNTUR_CENTER = { lat: 16.3067, lng: 80.4365 };

export default function GoogleRealtimeMap({ order }: GoogleRealtimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);

  const [deviceCoords, setDeviceCoords] = useState<{ lat: number; lng: number }>(GUNTUR_CENTER);
  const [realAddress, setRealAddress] = useState<string>(order?.delivery_address || 'Brodipet 5th Line, Guntur City, Andhra Pradesh 522002');
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number }>({ lat: 16.3075, lng: 80.4375 });

  // Kitchen Coordinates (Guntur Arundelpet)
  const kitchenCoords = {
    lat: order?.coordinates?.lat || 16.3070,
    lng: order?.coordinates?.lng || 80.4370
  };

  // Customer Coordinates (Guntur Brodipet)
  const customerCoords = {
    lat: 16.3020,
    lng: 80.4320
  };

  // 1. Acquire Physical Device Coordinates on Mount
  useEffect(() => {
    async function initLocation() {
      const coords = await geolocationService.getDeviceCoordinates();
      // If browser GPS is outside Guntur or unpermitted, stay centered within Guntur City
      if (Math.abs(coords.lat - GUNTUR_CENTER.lat) > 1.0) {
        setDeviceCoords(GUNTUR_CENTER);
        setDriverPos({ lat: 16.3075, lng: 80.4375 });
      } else {
        setDeviceCoords(coords);
        setDriverPos(coords);
      }

      if (order?.delivery_address) {
        setRealAddress(order.delivery_address);
      } else {
        const addressText = await geolocationService.reverseGeocode(GUNTUR_CENTER.lat, GUNTUR_CENTER.lng);
        setRealAddress(addressText);
      }
    }

    initLocation();
  }, [order]);

  // 2. Real Operational Driver Location Stream
  useEffect(() => {
    if (!order) return;

    if (['OUT_FOR_DELIVERY', 'PICKED_UP'].includes(order.status)) {
      if (order.coordinates) {
        setDriverPos(order.coordinates);
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng([order.coordinates.lat, order.coordinates.lng]);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([order.coordinates.lat, order.coordinates.lng]);
          }
        }
      }
    }
  }, [order?.status, order?.coordinates]);

  // 3. Initialize Leaflet Map Instance Centered 100% inside Guntur City
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }

    function initMap() {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      const centerLat = GUNTUR_CENTER.lat;
      const centerLng = GUNTUR_CENTER.lng;

      // Initialize map zoomed directly into Guntur City Center
      const map = window.L.map(mapRef.current).setView([centerLat, centerLng], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; FlashBites Realtime Order Tracking Engine - Guntur City'
      }).addTo(map);

      // Kitchen Pickup Point Marker (Guntur Arundelpet)
      const restLat = kitchenCoords.lat;
      const restLng = kitchenCoords.lng;
      const restIcon = window.L.divIcon({
        className: 'custom-rest-icon',
        html: '<div style="background:#f59e0b;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.2);">🍳</div>'
      });
      window.L.marker([restLat, restLng], { icon: restIcon })
        .addTo(map)
        .bindPopup(`<b>${order?.restaurant_name || 'Sri Udipi Grand (Arundelpet, Guntur)'}</b>`);

      // Customer Dropoff Destination Marker (Guntur Brodipet)
      const custLat = customerCoords.lat;
      const custLng = customerCoords.lng;
      const custIcon = window.L.divIcon({
        className: 'custom-cust-icon',
        html: '<div style="background:#e11d48;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.2);">👤</div>'
      });
      window.L.marker([custLat, custLng], { icon: custIcon })
        .addTo(map)
        .bindPopup(`<b>Delivery Destination</b><br>${realAddress}`);

      // Driver Marker (Guntur Arundelpet/Brodipet area)
      const driverLat = 16.3075;
      const driverLng = 80.4375;
      const driverIcon = window.L.divIcon({
        className: 'custom-driver-icon',
        html: '<div style="background:#059669;color:white;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);">🛵</div>'
      });
      driverMarkerRef.current = window.L.marker([driverLat, driverLng], { icon: driverIcon })
        .addTo(map)
        .bindPopup(`<b>Partner: ${order?.driver_name || 'Marcus Chen (Arundelpet, Guntur)'}</b>`);

      // Trajectory Polyline Route inside Guntur City
      window.L.polyline(
        [
          [restLat, restLng],
          [custLat, custLng]
        ],
        { color: '#e11d48', weight: 4, dashArray: '6, 8' }
      ).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [deviceCoords, realAddress, order]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Order #{order?.id || 'TRACKING'} • Guntur City Delivery Map
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="font-semibold text-slate-800 truncate max-w-lg">{realAddress}</span>
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full text-xs font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{order?.status ? order.status.replace(/_/g, ' ') : 'ACTIVE ORDER'}</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div
        ref={mapRef}
        className="w-full h-80 rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-50"
      />

      {/* Realtime Geodesic Distance Meter & Telemetry HUD inside Guntur City */}
      <RealtimeDistanceMeter
        originCoords={driverPos}
        destinationCoords={customerCoords}
        label={`Guntur Live Tracking: ${order?.driver_name || 'Driver'} ➔ Customer Dropoff`}
        speedKmh={28}
      />

    </div>
  );
}
