import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerDashboard from './components/CustomerDashboard';
import RestaurantDashboard from './components/RestaurantDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import GeminiNavAssistant from './components/GeminiNavAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MultiCategoryAuthForm } from './components/auth/MultiCategoryAuthForm';
import { RESTAURANTS, INITIAL_ORDERS, DRIVERS } from './data/mockData';
import { orderService } from './services/orderService';

function MainAppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);

  // Auto Onboard New Restaurant when Kitchen user registers
  useEffect(() => {
    if (user && user.role === 'RESTAURANT' && user.restaurantName) {
      setRestaurants((prev) => {
        const exists = prev.some((r) => r.owner_id === user.id || r.name.toLowerCase() === user.restaurantName?.toLowerCase());
        if (!exists) {
          const newRest = {
            id: `rest-${Date.now()}`,
            name: user.restaurantName,
            owner_id: user.id,
            owner_email: user.email,
            cuisine: user.cuisine || 'Multi-Cuisine & Fast Food',
            rating: 5.0,
            prepTime: '15-20 mins',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
            location: { address: user.address || 'Guntur', lat: 16.3067, lng: 80.4365 },
            menu: []
          };
          return [newRest, ...prev];
        }
        return prev;
      });
    }
  }, [user]);

  const activeOrder = orders.length > 0 ? orders.find((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED') || null : null;

  const handleAddDish = (restaurantId, newDish) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((rest) => {
        if (rest.id === restaurantId || rest.owner_id === user?.id || (user?.restaurantName && rest.name.toLowerCase() === user.restaurantName.toLowerCase())) {
          return {
            ...rest,
            menu: [newDish, ...rest.menu]
          };
        }
        return rest;
      })
    );
  };

  const handleToggleStock = (restaurantId, itemId) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((rest) => {
        if (rest.id === restaurantId || rest.owner_id === user?.id || (user?.restaurantName && rest.name.toLowerCase() === user.restaurantName.toLowerCase())) {
          return {
            ...rest,
            menu: rest.menu.map((item) =>
              item.id === itemId ? { ...item, is_available: !item.is_available } : item
            )
          };
        }
        return rest;
      })
    );
  };

  const handlePlaceOrder = async ({ restaurant, items, totalAmount, deliveryAddress }) => {
    const newOrder = await orderService.placeOrder({
      restaurant,
      items,
      totalAmount,
      deliveryAddress,
      customerId: user?.id,
      customerName: user?.name,
      customerPhone: '+91 98765 43210'
    });

    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    let driverInfo;
    if (newStatus === 'READY_FOR_PICKUP') {
      driverInfo = { name: DRIVERS[0].name, phone: DRIVERS[0].phone };
    }

    await orderService.updateOrderStatus(orderId, newStatus, driverInfo);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        return {
          ...ord,
          status: newStatus,
          driver_name: driverInfo ? driverInfo.name : ord.driver_name,
          driver_phone: driverInfo ? driverInfo.phone : ord.driver_phone,
          updated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      })
    );
  };

  const handleCancelOrder = async (orderId) => {
    await orderService.updateOrderStatus(orderId, 'CANCELLED');

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        if (!['PLACED', 'CONFIRMED'].includes(ord.status)) {
          alert('Cannot cancel order: Food preparation has already begun.');
          return ord;
        }
        return {
          ...ord,
          status: 'CANCELLED',
          cancel_reason: 'Cancelled by customer before kitchen cooking phase'
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative">
      
      {/* Navbar */}
      <Navbar
        user={user}
        onSignOut={logout}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* LOGGED OUT: AUTHENTICATION */}
        {!isAuthenticated && (
          <div className="py-8">
            <MultiCategoryAuthForm />
          </div>
        )}

        {/* LOGGED IN: ROLE PROTECTED DASHBOARDS */}
        {isAuthenticated && user && (
          <>
            {user.role === 'CUSTOMER' && (
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerDashboard
                  restaurants={restaurants}
                  activeOrder={activeOrder}
                  cart={cart}
                  setCart={setCart}
                  onPlaceOrder={handlePlaceOrder}
                  onCancelOrder={handleCancelOrder}
                />
              </ProtectedRoute>
            )}

            {user.role === 'RESTAURANT' && (
              <ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']}>
                <RestaurantDashboard
                  restaurants={restaurants}
                  orders={orders}
                  onAddDish={handleAddDish}
                  onToggleStock={handleToggleStock}
                  onUpdateStatus={handleUpdateStatus}
                  onCancelOrder={handleCancelOrder}
                />
              </ProtectedRoute>
            )}

            {user.role === 'DELIVERY_PARTNER' && (
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                <DeliveryDashboard
                  orders={orders}
                  onUpdateStatus={handleUpdateStatus}
                />
              </ProtectedRoute>
            )}
          </>
        )}

      </main>

      {/* FLOATING GEMINI AI NAVIGATION ASSISTANT */}
      <GeminiNavAssistant
        apiKey={import.meta.env.VITE_GEMINI_API_KEY || ''}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <span>FlashBites Express</span>
          <span className="text-slate-500">© 2026 FlashBites. Powered by Google Gemini AI.</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
