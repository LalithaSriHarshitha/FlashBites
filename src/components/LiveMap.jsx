import React from 'react';
import { Store, User, Bike, Navigation, MapPin } from 'lucide-react';

export default function LiveMap({ order }) {
  if (!order) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-500 border border-slate-200 bg-white">
        <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm">No active order tracking available</p>
      </div>
    );
  }

  const restX = 20;
  const restY = 60;
  const custX = 80;
  const custY = 30;

  let driverX = restX;
  let driverY = restY;

  if (order.status === 'OUT_FOR_DELIVERY') {
    driverX = 55;
    driverY = 45;
  } else if (order.status === 'DELIVERED') {
    driverX = custX;
    driverY = custY;
  }

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-200 relative overflow-hidden bg-white shadow-xl">
      
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-rose-600 animate-spin-slow" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Real-Time GPS Telemetry Tracker
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● Telemetry Live (2.4 GHz)
        </span>
      </div>

      {/* SVG Canvas Map Simulation */}
      <div className="w-full h-56 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-200 p-2">
        
        {/* Map Grid lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-200" strokeWidth="1">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
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
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border border-amber-600">
            <Store className="w-4 h-4" />
          </div>
          <span className="mt-1 text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
            {order.restaurantName}
          </span>
        </div>

        {/* Customer Pin */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ left: `${custX}%`, top: `${custY}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border border-rose-700">
            <User className="w-4 h-4" />
          </div>
          <span className="mt-1 text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
            Destination: Dorm B
          </span>
        </div>

        {/* Delivery Driver Marker */}
        {['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all duration-1000 ease-in-out"
            style={{ left: `${driverX}%`, top: `${driverY}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20 animate-pulse">
              <Bike className="w-5 h-5 font-bold" />
            </div>
            <span className="mt-1 text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300 shadow">
              {order.driver ? order.driver.name : 'Delivery Partner'}
            </span>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Kitchen Pick Up</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Live Driver GPS</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>Customer Dropoff</span>
        </div>
      </div>
    </div>
  );
}
