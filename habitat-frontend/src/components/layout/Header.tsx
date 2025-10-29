'use client';

import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left: Menu Button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
