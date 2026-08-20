import React from 'react';
import { Store, User, Bike, Navigation } from 'lucide-react';
import { Order } from '../types';

interface LeafletMapProps {
  order?: Order | null;
}

export default function LeafletMap({ order }: LeafletMapProps) {
  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-slate-500 border border-slate-200">
        <Navigation className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-semibold">No active order tracking available</p>
      </div>
    );
  }

  // OpenStreetMap coordinate bounds simulation
  const restX = 20;
  const restY = 60;
  const custX = 80;
  const custY = 30;

  let driverX = restX;
  let driverY = restY;

  if (order.status === 'PICKED_UP') {
    driverX = 35;
    driverY = 52;
  } else if (order.status === 'OUT_FOR_DELIVERY') {
    driverX = 60;
    driverY = 40;
  } else if (order.status === 'DELIVERED') {
    driverX = custX;
    driverY = custY;
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xl relative overflow-hidden">
      
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-rose-600 animate-spin-slow" />
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
            OpenStreetMap Live Partner Telemetry
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● OpenStreetMap GPS Signal Active
        </span>
      </div>

      {/* Map Canvas Frame */}
      <div className="w-full h-56 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-200 p-2">
        
        {/* OpenStreetMap Tile Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <svg className="absolute inset-0 w-full h-full stroke-slate-300" strokeWidth="1">
          <line
            x1={`${restX}%`}
            y1={`${restY}%`}
            x2={`${custX}%`}
            y2={`${custY}%`}
            stroke="#e11d48"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>

        {/* Restaurant Pin */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `${restX}%`, top: `${restY}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Store className="w-4 h-4" />
          </div>
          <span className="mt-1 text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
            {order.restaurant_name || 'Kitchen'}
          </span>
        </div>

        {/* Customer Pin */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `${custX}%`, top: `${custY}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <User className="w-4 h-4" />
          </div>
          <span className="mt-1 text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
            Dropoff Destination
          </span>
        </div>

        {/* Moving Delivery Partner Marker */}
        {['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all duration-1000 ease-in-out"
            style={{ left: `${driverX}%`, top: `${driverY}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20 animate-pulse border-2 border-white">
              <Bike className="w-5 h-5 font-bold" />
            </div>
            <span className="mt-1 text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow">
              {order.driver_name || 'Marcus Chen (Partner)'}
            </span>
          </div>
        )}

      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Restaurant</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Live Driver Telemetry</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>Customer Address</span>
        </div>
      </div>
    </div>
  );
}
