import React, { useState } from 'react';
import { 
  ChefHat, Check, X, Clock, Bike, CheckCircle2, 
  DollarSign, PackageCheck, AlertCircle, Edit, PlusCircle, ToggleLeft, ToggleRight, Plus, Upload, Bell, Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dispatchService } from '../services/dispatchService';
import { Order } from '../types';

interface RestaurantDashboardProps {
  restaurants?: any[];
  orders: Order[];
  onAddDish?: (restaurantId: string, dish: any) => void;
  onToggleStock?: (restaurantId: string, itemId: string) => void;
  onUpdateStatus: (orderId: string, newStatus: any) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function RestaurantDashboard({
  restaurants,
  orders,
  onAddDish,
  onToggleStock,
  onUpdateStatus,
  onCancelOrder
}: RestaurantDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'KDS' | 'MENU_STOCK'>('KDS');
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Find active restaurant matching user or user's restaurant name
  const activeRestaurant = (restaurants || []).find(
    (r) => r.owner_id === user?.id || (user?.restaurantName && r.name.toLowerCase() === user.restaurantName.toLowerCase())
  ) || restaurants?.[0] || {
    id: `rest-${Date.now()}`,
    name: user?.restaurantName || 'My Restaurant Kitchen',
    cuisine: user?.cuisine || 'Multi-Cuisine & Fast Food',
    location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru' },
    menu: []
  };

  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    description: '',
    is_veg: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter orders intended for this restaurant
  const restaurantOrders = orders.filter(
    (o) => o.restaurant_id === activeRestaurant.id || o.restaurant_name?.toLowerCase() === activeRestaurant.name.toLowerCase()
  );

  const activeCookingOrders = restaurantOrders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING'].includes(o.status));
  const completedOrders = restaurantOrders.filter((o) => o.status === 'DELIVERED');
  const totalRevenue = restaurantOrders.reduce((sum, o) => (o.status !== 'CANCELLED' ? sum + o.total_amount : sum), 0);

  // Handle Dispatch & Proximity Driver Notification
  const handleNotifyDrivers = async (orderId: string, totalAmount: number) => {
    onUpdateStatus(orderId, 'READY_FOR_PICKUP');
    
    const lat = activeRestaurant.location?.lat || 12.9716;
    const lng = activeRestaurant.location?.lng || 77.5946;

    const result = await dispatchService.notifyNearbyDrivers(
      orderId,
      activeRestaurant.name,
      lat,
      lng,
      totalAmount
    );

    setDispatchNotice(`🔔 Dispatch Alert Broadcasted! Notified ${result.notifiedDriversCount} nearby delivery partners within 5 km.`);
    setTimeout(() => setDispatchNotice(null), 5000);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewDish((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;

    const dishToAdd = {
      id: `m-${Date.now()}`,
      name: newDish.name,
      price: parseFloat(newDish.price),
      description: newDish.description || `${newDish.name} prepared freshly at ${activeRestaurant.name}`,
      is_veg: newDish.is_veg,
      is_available: true,
      category: 'ALL',
      image: newDish.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'
    };

    if (onAddDish) {
      onAddDish(activeRestaurant.id, dishToAdd);
    }

    setIsAddDishOpen(false);
    setImagePreview(null);
    setNewDish({ name: '', price: '', description: '', is_veg: true, image: '' });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Kitchen Display System Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Kitchen Display System (KDS)</h2>
            <p className="text-xs text-slate-500">{activeRestaurant.name} • Order Fulfillment Console</p>
          </div>
        </div>

        {/* Realtime Metrics */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Cooking</span>
            <span className="font-black text-amber-600 text-base">{activeCookingOrders.length}</span>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Fulfilled Today</span>
            <span className="font-black text-emerald-600 text-base">{completedOrders.length}</span>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Kitchen Revenue</span>
            <span className="font-black text-rose-600 text-base">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Dispatch Broadcast Toast Banner */}
      {dispatchNotice && (
        <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-lg flex items-center space-x-2 animate-bounce text-xs font-bold">
          <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{dispatchNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('KDS')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'KDS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            👨‍🍳 Live Kitchen Queue ({restaurantOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length})
          </button>

          <button
            onClick={() => setActiveTab('MENU_STOCK')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'MENU_STOCK'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🍕 Menu Stock & Item Availability ({(activeRestaurant.menu || []).length})
          </button>
        </div>

        {/* Upload Dish Button */}
        <button
          onClick={() => setIsAddDishOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all hover:scale-105"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload Local Photo & Add Dish</span>
        </button>
      </div>

      {/* TAB 1: KITCHEN DISPLAY QUEUE */}
      {activeTab === 'KDS' && (
        <div className="space-y-4">
          {restaurantOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-sm space-y-2">
              <ChefHat className="w-12 h-12 mx-auto opacity-30 text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-800">Kitchen Queue Active for {activeRestaurant.name}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No orders placed for {activeRestaurant.name} yet. Customers will place orders from your menu grid!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {restaurantOrders.map((ord) => {
                const isCancelled = ord.status === 'CANCELLED';

                return (
                  <div
                    key={ord.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xl transition-all ${
                      isCancelled ? 'border-rose-200 bg-rose-50/20 opacity-70' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-base">#{ord.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Customer: <strong className="text-slate-800">{ord.customer_name || 'Customer'}</strong> ({ord.customer_phone || '+91 98765 43210'})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-base">₹{ord.total_amount}</span>
                        <p className="text-[11px] text-slate-400">Placed: {ord.created_at || 'Just now'}</p>
                      </div>
                    </div>

                    {/* Ordered Items Checklist */}
                    <div className="bg-slate-50 rounded-2xl p-3 mb-4 space-y-1 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kitchen Prep Checklist</span>
                      {ord.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-800 py-0.5">
                          <span className="font-bold">• {item.quantity}x {item.name || item.menu_item_id}</span>
                          <span className="font-semibold text-slate-500">₹{(item.price_at_order || item.price) * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    {!isCancelled && ord.status !== 'DELIVERED' && (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center space-x-2">
                          {ord.status === 'PLACED' && (
                            <>
                              <button
                                onClick={() => onUpdateStatus(ord.id, 'CONFIRMED')}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 shadow-sm"
                              >
                                <Check className="w-4 h-4" />
                                <span>Accept Order</span>
                              </button>
                              <button
                                onClick={() => onCancelOrder(ord.id)}
                                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200"
                              >
                                Reject & Refund
                              </button>
                            </>
                          )}

                          {ord.status === 'CONFIRMED' && (
                            <button
                              onClick={() => onUpdateStatus(ord.id, 'PREPARING')}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 shadow-sm"
                            >
                              <ChefHat className="w-4 h-4" />
                              <span>Start Cooking (Preparing)</span>
                            </button>
                          )}

                          {ord.status === 'PREPARING' && (
                            <button
                              onClick={() => handleNotifyDrivers(ord.id, ord.total_amount)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-600/25"
                            >
                              <Bell className="w-4 h-4 animate-bounce" />
                              <span>Mark Ready & Notify Nearby Drivers (Within 5 km)</span>
                            </button>
                          )}

                          {['READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(ord.status) && (
                            <div className="text-xs text-emerald-700 flex items-center space-x-1 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Notified Nearby Drivers • Assigned: {ord.driver_name || 'Marcus Chen'}</span>
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-medium italic">
                          Status: {ord.status}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU STOCK & AVAILABILITY MANAGER */}
      {activeTab === 'MENU_STOCK' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Menu Item Stock Controller ({activeRestaurant.name})</h3>
              <p className="text-xs text-slate-500">Toggle dishes in/out of stock in real time</p>
            </div>
          </div>

          {(activeRestaurant.menu || []).length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Upload className="w-10 h-10 mx-auto opacity-30 text-rose-600" />
              <p className="text-sm font-bold text-slate-700">No dishes uploaded for {activeRestaurant.name} yet</p>
              <p className="text-xs text-slate-500">Click "+ Upload Local Photo & Add Dish" top right to publish your menu!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRestaurant.menu.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">₹{item.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStock && onToggleStock(activeRestaurant.id, item.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      item.is_available !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {item.is_available !== false ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-rose-600" />}
                    <span>{item.is_available !== false ? 'In Stock (Active)' : 'Out of Stock'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / UPLOAD DISH MODAL FORM */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Upload New Dish to {activeRestaurant.name}</h3>
              <button onClick={() => setIsAddDishOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Paneer Butter Masala"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 220"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* LOCAL FILE UPLOAD FIELD */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Upload Photo from Local Computer *</label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-rose-500 bg-slate-50 hover:bg-rose-50/20 transition-all">
                  {imagePreview || newDish.image ? (
                    <div className="flex flex-col items-center space-y-2">
                      <img src={imagePreview || newDish.image} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-md" />
                      <span className="text-[11px] font-bold text-rose-600">Click to change local photo</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1 text-slate-500">
                      <Upload className="w-6 h-6 text-rose-600" />
                      <span className="text-xs font-bold text-slate-800">Click to browse photo from computer</span>
                      <span className="text-[10px]">PNG, JPG, WEBP supported</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* OPTIONAL URL FIELD */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Or Paste Dish Photo URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newDish.image}
                  onChange={(e) => {
                    setNewDish({ ...newDish, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-600/25 transition-all"
              >
                Publish Dish to {activeRestaurant.name}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
