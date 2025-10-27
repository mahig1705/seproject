'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, AuthResponse } from '@/types';
import { apiService } from '@/services/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    flatNumber?: string;
    building?: string;
    occupantsCount?: number;
  }) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          // Verify token by making a request to get user info
          const response = await apiService.getUserById('me');
          if (response.success) {
            setUser(response.data);
          } else {
            // Token is invalid, clear it
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
          }
        } catch (error) {
          // Token is invalid, clear it
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await apiService.login(email, password);
    console.log('Login response:', response); // Debugging

    if (!response.success) {
      toast.error(response.message || 'Login failed');
      return false;
    }

    const { user, token } = response.data; // token, not accessToken
    setUser(user);
    Cookies.set('accessToken', token, { expires: 7 }); // store JWT
    toast.success('Login successful!');
    return true;
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Login failed');
    return false;
  }
};

  const register = async (userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  flatNumber?: string;
  building?: string;
  occupantsCount?: number;
}): Promise<boolean> => {
  try {
    const response = await apiService.register(userData);
    console.log('Register response:', response); // debug

    if (!response.success) {
      toast.error(response.message); // now TS safe
      return false;
    }

    const { user, token } = response.data; // token, not accessToken
    setUser(user);
    Cookies.set('accessToken', token, { expires: 7 });
    toast.success(response.message || 'Registration successful!');
    return true;
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.response?.data?.message || 'Registration failed');
    return false;
  }
};


  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      toast.success('Logged out successfully');
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Define permissions based on roles
    const permissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: [
        'users:read', 'users:write', 'users:delete',
        'bills:read', 'bills:write', 'bills:delete',
        'notices:read', 'notices:write', 'notices:delete',
        'amenities:read', 'amenities:write', 'amenities:delete',
        'bookings:read', 'bookings:write', 'bookings:delete',
        'issues:read', 'issues:write', 'issues:delete',
        'tickets:read', 'tickets:write', 'tickets:delete',
        'visitors:read', 'visitors:write',
        'technicians:read', 'technicians:write', 'technicians:delete',
        'payments:read'
      ],
      [UserRole.COMMITTEE]: [
        'users:read', 'users:write',
        'bills:read', 'bills:write',
        'notices:read', 'notices:write', 'notices:delete',
        'amenities:read', 'amenities:write', 'amenities:delete',
        'bookings:read', 'bookings:write', 'bookings:delete',
        'issues:read', 'issues:write', 'issues:delete',
        'tickets:read', 'tickets:write', 'tickets:delete',
        'visitors:read', 'visitors:write',
        'technicians:read', 'technicians:write', 'technicians:delete',
        'payments:read'
      ],
      [UserRole.RESIDENT]: [
        'bills:read','bills:write',
        'notices:read',
        'amenities:read',
        'bookings:read', 'bookings:write',
        'issues:read', 'issues:write',
        'visitors:read', 'visitors:write',
        'payments:read'
      ],
      [UserRole.TENANT]: [
        'bills:read',
        'notices:read',
        'amenities:read',
        'bookings:read', 'bookings:write',
        'issues:read', 'issues:write',
        'visitors:read', 'visitors:write',
        'payments:read'
      ],
      [UserRole.SECURITY]: [
        'notices:read',
        'visitors:read', 'visitors:write'
      ],
      [UserRole.TECHNICIAN]: [
        'notices:read',
        'tickets:read', 'tickets:write'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
