import React, { useState } from 'react';
import { Bike, MapPin, CheckCircle2, Play } from 'lucide-react';

export default function DeliveryView({
  orders = [],
  onUpdateStatus = () => {}
}) {
  const [isOnline, setIsOnline] = useState(true);

  // Safely filter ready & active delivery orders
  const safeOrders = Array.isArray(orders) ? orders : [];
  const readyOrders = safeOrders.filter(
    (o) => o && o.status && ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'PICKED_UP'].includes(o.status)
  );
  const activeDelivery = readyOrders.length > 0 ? readyOrders[0] : null;

  const handleStartDelivery = (orderId) => {
    if (onUpdateStatus && orderId) {
      onUpdateStatus(orderId, 'OUT_FOR_DELIVERY');
    }
  };

  const handleMarkDelivered = (orderId) => {
    if (onUpdateStatus && orderId) {
      onUpdateStatus(orderId, 'DELIVERED');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Status Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Delivery Partner Dispatch Console</h2>
            <p className="text-xs text-slate-500">Proximity GPS Dispatch Engine (Guntur City Active)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-black transition-all border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
          <span>{isOnline ? '● ONLINE & ACCEPTING DELIVERIES' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* ACTIVE TASK CARD */}
      {activeDelivery ? (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase">
                Active Task #{activeDelivery.id}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Pickup from: {activeDelivery.restaurant_name || 'Sri Udipi Grand'}
              </h3>
            </div>

            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
              Status: {activeDelivery.status ? activeDelivery.status.replace(/_/g, ' ') : 'READY'}
            </span>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer & Address</span>
              <p className="font-extrabold text-slate-900">{activeDelivery.customer_name || 'Anand Kumar'}</p>
              <p className="text-slate-600 flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span className="font-medium">{activeDelivery.delivery_address || 'Brodipet, Guntur'}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Earnings & Items</span>
              <p className="font-extrabold text-emerald-600 text-base">₹{activeDelivery.total_amount || 120}</p>
              <p className="text-slate-500">{activeDelivery.items?.length || 1} Food Items Packed</p>
            </div>
          </div>

          {/* Operational Action Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeDelivery.status === 'READY_FOR_PICKUP' && (
              <button
                type="button"
                onClick={() => handleStartDelivery(activeDelivery.id)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Confirm Food Pickup & Start Live GPS Navigation</span>
              </button>
            )}

            {activeDelivery.status === 'OUT_FOR_DELIVERY' && (
              <button
                type="button"
                onClick={() => handleMarkDelivered(activeDelivery.id)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Handover to Customer & Mark Order Delivered</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-sm space-y-2">
          <Bike className="w-12 h-12 mx-auto text-emerald-600 opacity-40" />
          <h3 className="text-base font-extrabold text-slate-800">No Active Deliveries Assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When a kitchen marks an order ready, nearby drivers within 5 km in Guntur City receive instant real-time dispatch alerts!
          </p>
        </div>
      )}

    </div>
  );
}
