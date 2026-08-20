import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4 max-w-md mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-extrabold text-slate-900">Authentication Required</h3>
        <p className="text-xs text-slate-500">Please sign in to access your role-protected dashboard.</p>
      </div>
    );
  }

  if (!hasRole(allowedRoles)) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-rose-900">403 Forbidden Access</h3>
          <p className="text-xs text-slate-600 mt-1">
            Your account role (<strong className="text-slate-900">{user.role}</strong>) does not have permission to view this portal.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md flex items-center justify-center space-x-1.5 mx-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out & Switch Account</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
