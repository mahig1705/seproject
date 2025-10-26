'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Users, Shield, CreditCard, Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Habitat</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern Society
              <span className="text-primary-600"> Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your housing society operations with our comprehensive management platform. 
              Handle bills, issues, visitors, amenities, and more with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/register')}
                className="text-lg px-8 py-3"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/login')}
                className="text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your society
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for modern society management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage residents, tenants, and staff with role-based access control.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>Bills & Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate bills, track payments, and manage financial records efficiently.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>Notices & Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Send notices, announcements, and keep residents informed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>Security & Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track visitor entries and exits with comprehensive security logs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>Amenities & Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage amenity bookings and reservations for residents.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Home className="w-8 h-8 text-primary-600 mb-2" />
                <CardTitle>Issue Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Report and track maintenance issues with priority management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of societies already using our platform
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push('/register')}
            className="text-lg px-8 py-3"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Habitat</span>
            </div>
            <p className="text-gray-400">
              © 2024 Habitat Society Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
