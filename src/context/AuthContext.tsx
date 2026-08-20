import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface SignupParams {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  restaurantName?: string;
  cuisine?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (params: SignupParams) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ALL 14 ACCOUNTS LOCALIZED STRICTLY TO GUNTUR CITY, ANDHRA PRADESH
export const INITIAL_PRESEEDED_USERS: User[] = [
  // 1 CUSTOMER ACCOUNT
  {
    id: 'usr-c-1',
    name: 'Anand Kumar',
    email: 'customer1@flashbites.com',
    role: 'CUSTOMER',
    address: 'Brodipet 5th Line, Guntur City, Andhra Pradesh 522002'
  },

  // 5 SOUTH INDIAN KITCHEN ACCOUNTS (GUNTUR CITY)
  {
    id: 'usr-k-udipi',
    name: 'Ramesh Bhat',
    email: 'udipi@flashbites.com',
    role: 'RESTAURANT',
    restaurantName: 'Sri Udipi Grand',
    cuisine: 'Guntur Spicy Tiffin & Filter Coffee',
    address: 'Arundelpet 14th Line, Guntur, Andhra Pradesh'
  },
  {
    id: 'usr-k-saravana',
    name: 'Senthil Nathan',
    email: 'saravana@flashbites.com',
    role: 'RESTAURANT',
    restaurantName: 'Saravana Bhavan Express',
    cuisine: 'Pure Veg Andhra & Chettinad Meals',
    address: 'Brodipet 4/12, Guntur, Andhra Pradesh'
  },
  {
    id: 'usr-k-paradise',
    name: 'Mohammed Tariq',
    email: 'paradise@flashbites.com',
    role: 'RESTAURANT',
    restaurantName: 'Hyderabadi Paradise Biryani',
    cuisine: 'Hyderabadi Dum Biryani & Guntur Chicken Fry',
    address: 'RTC Bus Stand Road, Guntur, Andhra Pradesh'
  },
  {
    id: 'usr-k-mtr',
    name: 'Yajnaram Maiya',
    email: 'mtr@flashbites.com',
    role: 'RESTAURANT',
    restaurantName: 'MTR (Mavalli Tiffin Room)',
    cuisine: 'Heritage Rava Dosa & Filter Coffee',
    address: 'Lakshmipuram Main Road, Guntur, Andhra Pradesh'
  },
  {
    id: 'usr-k-anandbhavan',
    name: 'Anand Ponnaluri',
    email: 'anandbhavan@flashbites.com',
    role: 'RESTAURANT',
    restaurantName: 'Anand Bhavan Tiffin Center',
    cuisine: 'Guntur Karam Podi Dosa & Chutneys',
    address: 'Kothapet Market, Guntur, Andhra Pradesh'
  },

  // 8 DELIVERY PARTNER ACCOUNTS (GUNTUR CITY)
  { id: 'usr-d-1', name: 'Marcus Chen', email: 'driver1@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Arundelpet, Guntur' },
  { id: 'usr-d-2', name: 'Rajesh V', email: 'driver2@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Brodipet, Guntur' },
  { id: 'usr-d-3', name: 'Karthik Raja', email: 'driver3@flashbites.com', role: 'DELIVERY_PARTNER', address: 'RTC Bus Stand, Guntur' },
  { id: 'usr-d-4', name: 'Suresh Kumar', email: 'driver4@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Lakshmipuram, Guntur' },
  { id: 'usr-d-5', name: 'Venkatesh Prasad', email: 'driver5@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Kothapet, Guntur' },
  { id: 'usr-d-6', name: 'Arun Swaminathan', email: 'driver6@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Koritepadu, Guntur' },
  { id: 'usr-d-7', name: 'Praveen Reddy', email: 'driver7@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Patternabazar, Guntur' },
  { id: 'usr-d-8', name: 'Deepak Sharma', email: 'driver8@flashbites.com', role: 'DELIVERY_PARTNER', address: 'Old Guntur' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_PRESEEDED_USERS);
  const [isLoading, setIsLoading] = useState(false);

  // Restore saved session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('flashbites_user');
      const savedToken = localStorage.getItem('flashbites_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    }
  }, []);

  // Generate JWT Token
  const generateJWT = (userObj: User): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      })
    );
    const signature = btoa('flashbites_signature');
    return `${header}.${payload}.${signature}`;
  };

  const login = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      let existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!existingUser) {
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', cleanEmail);

          if (dbUser && dbUser.length > 0) {
            existingUser = dbUser[0];
          }
        } catch (e) {
          console.warn('Supabase fetch notice:', e);
        }
      }

      if (!existingUser) {
        existingUser = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'CUSTOMER',
          address: 'Brodipet, Guntur City, Andhra Pradesh'
        };

        setRegisteredUsers((prev) => [...prev, existingUser!]);
      }

      const jwtToken = generateJWT(existingUser);
      setUser(existingUser);
      setToken(jwtToken);

      localStorage.setItem('flashbites_user', JSON.stringify(existingUser));
      localStorage.setItem('flashbites_token', jwtToken);

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Authentication failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (params: SignupParams): Promise<{ success: boolean; message?: string; user?: User }> => {
    setIsLoading(true);
    try {
      const cleanEmail = params.email.trim().toLowerCase();

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: params.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: params.role,
        restaurantName: params.restaurantName,
        cuisine: params.cuisine,
        address: params.address || 'Guntur City, Andhra Pradesh'
      };

      supabase.from('users').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        restaurant_name: newUser.restaurantName || null,
        created_at: new Date().toISOString()
      }).catch((e) => console.warn('Supabase DB Insert Note:', e));

      setRegisteredUsers((prev) => [...prev, newUser]);

      const jwtToken = generateJWT(newUser);
      setUser(newUser);
      setToken(jwtToken);

      localStorage.setItem('flashbites_user', JSON.stringify(newUser));
      localStorage.setItem('flashbites_token', jwtToken);

      return { success: true, user: newUser };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create account in database.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flashbites_user');
    localStorage.removeItem('flashbites_token');
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
