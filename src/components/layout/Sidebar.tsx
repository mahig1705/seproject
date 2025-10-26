"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  CreditCard,
  Calendar,
  Bell,
  Shield,
  Wrench,
  UserCheck,
  Home,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout, hasRole, hasPermission } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT, UserRole.SECURITY, UserRole.TECHNICIAN]
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE],
      permission: 'users:read'
    },
    {
      name: 'Issues',
      href: '/issues',
      icon: AlertTriangle,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT],
      permission: 'issues:read'
    },
    {
      name: 'Visitors',
      href: '/visitors',
      icon: UserCheck,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.SECURITY],
      permission: 'visitors:read'
    },
    {
      name: 'Bills',
      href: '/bills',
      icon: CreditCard,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT],
      permission: 'bills:read'
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT],
      permission: 'payments:read'
    },
    {
      name: 'Notices',
      href: '/notices',
      icon: Bell,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT, UserRole.SECURITY, UserRole.TECHNICIAN],
      permission: 'notices:read'
    },
    {
      name: 'Amenities',
      href: '/amenities',
      icon: Home,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT],
      permission: 'amenities:read'
    },
    {
      name: 'Bookings',
      href: '/bookings',
      icon: Calendar,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE, UserRole.RESIDENT, UserRole.TENANT],
      permission: 'bookings:read'
    },
    {
      name: 'Technicians',
      href: '/technicians',
      icon: Wrench,
      roles: [UserRole.ADMIN, UserRole.COMMITTEE],
      permission: 'technicians:read'
    }
  ];

  const filteredNavigation = navigation.filter(item => {
    if (!user) return false;
    if (item.roles && !item.roles.includes(user.role)) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
  className={cn(
    'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  )}
>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Habitat</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
