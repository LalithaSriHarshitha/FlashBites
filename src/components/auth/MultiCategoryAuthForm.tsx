import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShoppingBag, Utensils, Bike, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, CheckCircle2, Building, MapPin, ChefHat } from 'lucide-react';

export const MultiCategoryAuthForm: React.FC = () => {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    cuisine: '',
    address: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in both Email and Password.');
      return;
    }

    if (authMode === 'SIGNUP') {
      if (!formData.name) {
        setErrorMessage('Please enter your Full Name.');
        return;
      }

      if (selectedRole === 'RESTAURANT' && !formData.restaurantName) {
        setErrorMessage('Please enter your Restaurant / Hotel Name.');
        return;
      }

      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        restaurantName: formData.restaurantName,
        cuisine: formData.cuisine || 'Multi-Cuisine & Fast Food',
        address: formData.address || 'Bengaluru'
      });

      if (!result.success) {
        setErrorMessage(result.message || 'Failed to create account.');
      } else {
        setSuccessMessage('Account created successfully! Logging you in...');
      }
    } else {
      // SIGN IN MODE
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message || 'Account not found. Please create an account first.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900">
          {authMode === 'SIGNUP' ? 'Create Your Account' : 'Sign In to Your Account'}
        </h2>
        <p className="text-xs text-slate-500">
          {authMode === 'SIGNUP' ? 'Enter your details below to register' : 'Enter registered email to access portal'}
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-100 justify-center space-x-8 text-sm font-extrabold pb-2">
        <button
          type="button"
          onClick={() => {
            setAuthMode('SIGNUP');
            setErrorMessage(null);
          }}
          className={`pb-2 transition-all ${
            authMode === 'SIGNUP' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Create Account
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('LOGIN');
            setErrorMessage(null);
          }}
          className={`pb-2 transition-all ${
            authMode === 'LOGIN' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Sign In
        </button>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-xs text-rose-700 font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Account Role Selector */}
      {authMode === 'SIGNUP' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Select Account Role *
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleSelect('CUSTOMER')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedRole === 'CUSTOMER' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('RESTAURANT')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedRole === 'RESTAURANT' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Kitchen</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('DELIVERY_PARTNER')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedRole === 'DELIVERY_PARTNER' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Delivery</span>
            </button>
          </div>
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === 'SIGNUP' && (
          <>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {selectedRole === 'RESTAURANT' ? 'Owner Full Name *' : 'Full Name *'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* RESTAURANT KITCHEN ONBOARDING FIELDS */}
            {selectedRole === 'RESTAURANT' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Restaurant / Hotel Name *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Food Court"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Cuisine Type</label>
                    <div className="relative">
                      <ChefHat className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. South Indian & Tiffin"
                        value={formData.cuisine}
                        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location / City</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="e.g. user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <span>{authMode === 'SIGNUP' ? 'Create Account & Register Hotel' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
