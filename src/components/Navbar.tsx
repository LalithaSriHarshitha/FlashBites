import React from 'react';
import { Utensils, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
  cartCount?: number;
}

export default function Navbar({ user, onSignOut, cartCount = 0 }: NavbarProps) {
  const getDisplayName = (): string => {
    if (!user) return 'User';
    if (user.role === 'RESTAURANT' && user.restaurantName) {
      return user.restaurantName;
    }
    return user.name || user.email || 'User';
  };

  const getRoleLabel = (): string => {
    if (!user) return '';
    if (user.role === 'CUSTOMER') return 'Customer';
    if (user.role === 'RESTAURANT') return 'Kitchen Partner';
    if (user.role === 'DELIVERY_PARTNER') return 'Delivery Partner';
    return user.role || 'User';
  };

  const displayName = getDisplayName();
  const avatarLetter = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-rose-600/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900">FlashBites</span>
            <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">Food Delivery</span>
          </div>
        </div>

        {/* User Info / Sign Out */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
                {avatarLetter}
              </div>
              <div className="text-left">
                <span className="font-extrabold text-xs text-slate-900 block leading-none">{displayName}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{getRoleLabel()}</span>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
