import React from 'react';
import { Navigation, Clock, Gauge } from 'lucide-react';
import { dispatchService } from '../services/dispatchService';

interface RealtimeDistanceMeterProps {
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  label?: string;
  speedKmh?: number;
}

export default function RealtimeDistanceMeter({
  originCoords = { lat: 16.3075, lng: 80.4375 },
  destinationCoords = { lat: 16.3020, lng: 80.4320 },
  label = 'Distance to Destination',
  speedKmh = 25
}: RealtimeDistanceMeterProps) {
  const safeOrigin = originCoords || { lat: 16.3075, lng: 80.4375 };
  const safeDest = destinationCoords || { lat: 16.3020, lng: 80.4320 };

  const originLat = safeOrigin.lat || 16.3075;
  const originLng = safeOrigin.lng || 80.4375;
  const destLat = safeDest.lat || 16.3020;
  const destLng = safeDest.lng || 80.4320;

  // Calculate geodesic distance in km using Haversine algorithm safely
  const distanceKm = dispatchService.calculateDistanceKm(
    originLat,
    originLng,
    destLat,
    destLng
  );

  const distanceMeters = Math.round(distanceKm * 1000);
  const etaMinutes = Math.max(1, Math.round((distanceKm / (speedKmh || 25)) * 60));

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 text-rose-400 font-bold">
          <Navigation className="w-4 h-4 animate-spin" />
          <span className="uppercase tracking-wider text-[11px]">{label}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
          Haversine Engine Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Distance</span>
          <span className="text-emerald-400 font-extrabold text-sm">
            {distanceKm < 1 ? `${distanceMeters} m` : `${distanceKm} km`}
          </span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Live ETA</span>
          <span className="text-amber-400 font-extrabold text-sm flex items-center justify-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{etaMinutes} mins</span>
          </span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Speed</span>
          <span className="text-cyan-400 font-extrabold text-sm flex items-center justify-center space-x-1">
            <Gauge className="w-3 h-3 text-cyan-400" />
            <span>{speedKmh} km/h</span>
          </span>
        </div>
      </div>
    </div>
  );
}
