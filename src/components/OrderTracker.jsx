import React from 'react';
import { ORDER_LIFECYCLE_STEPS } from '../data/mockData';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Bike, ShieldAlert } from 'lucide-react';

export default function OrderTracker({ order, onCancelOrder }) {
  if (!order) return null;

  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = ORDER_LIFECYCLE_STEPS.findIndex(s => s.key === order.status);
  const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-xl relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-slate-900">Order #{order.id}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isCancelled 
                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isCancelled ? 'CANCELLED' : order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Restaurant: <strong className="text-slate-800">{order.restaurantName}</strong> • Placed at {order.placedAt}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {canCancel && !isCancelled && (
            <button
              onClick={() => onCancelOrder(order.id)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}

          {!canCancel && !isCancelled && order.status !== 'DELIVERED' && (
            <div className="flex items-center space-x-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Prep started — non-cancellable</span>
            </div>
          )}
        </div>
      </div>

      {/* Cancelled State Display */}
      {isCancelled ? (
        <div className="my-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h4 className="font-bold text-rose-800 text-sm">Order Has Been Cancelled</h4>
          <p className="text-xs text-slate-600 mt-1">
            Reason: {order.cancellation_reason || 'Cancelled by customer before kitchen preparation.'}
          </p>
        </div>
      ) : (
        /* Lifecycle Progress Timeline */
        <div className="my-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIndex) / (ORDER_LIFECYCLE_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-7 gap-1 relative z-10">
              {ORDER_LIFECYCLE_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-500/20 scale-110 shadow-md'
                        : isDone
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-white border border-slate-300 text-slate-400'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-[10px] font-bold leading-tight ${
                      isCurrent ? 'text-rose-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Driver Info Card if assigned */}
      {order.driver && !isCancelled && (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{order.driver.name}</p>
              <p className="text-[11px] text-slate-500">{order.driver.vehicle} • ★ {order.driver.rating}</p>
            </div>
          </div>
          <a 
            href={`tel:${order.driver.phone}`}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-all"
          >
            Call Driver
          </a>
        </div>
      )}

    </div>
  );
}
