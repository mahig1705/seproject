'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  AlertTriangle, 
  CreditCard, 
  Bell, 
  Calendar, 
  UserCheck,
  Clock
} from 'lucide-react';
import { UserRole } from '@/types';
import { formatDate } from '@/lib/utils';
import { apiService } from '@/services/api';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalIssues: number;
  totalBills: number;
  totalVisitors: number;
  activeVisitors: number;
  pendingIssues: number;
  pendingBills: number;
  recentNotices: any[];
  recentIssues: any[];
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalIssues: 0,
    totalBills: 0,
    totalVisitors: 0,
    activeVisitors: 0,
    pendingIssues: 0,
    pendingBills: 0,
    recentNotices: [],
    recentIssues: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("📊 Fetching dashboard data...");
        setIsLoading(true);
        setError(null); // ✅ Reset error state

        // ✅ Fetch notices and issues (shown to all roles)
        const [noticesResp, recentIssues] = await Promise.all([
          apiService.getNotices({ limit: 5 }),
          apiService.getIssues({ page: 1, limit: 5 })
        ]);

        console.log("✅ Notices:", noticesResp);
        console.log("✅ Recent Issues:", recentIssues);

        // ✅ Initialize stats variables
        let totalUsers = 0;
        let totalBills = 0;
        let pendingBills = 0;
        let totalVisitors = 0;
        let activeVisitors = 0;
        let totalIssues = 0;
        let pendingIssues = 0;

        // ✅ SECURITY: Only fetch visitor stats
        if (hasRole([UserRole.SECURITY])) {
          const visitors = await apiService.getVisitors({ page: 1, limit: 1000 });
          console.log("🚪 Security - Visitors:", visitors);

          totalVisitors = visitors.length;
          activeVisitors = visitors.filter((v: any) => !v.outTime).length;

          console.log(`✅ Security stats: total=${totalVisitors}, active=${activeVisitors}`);
        }

        // ✅ ADMIN/COMMITTEE: See everything
        if (hasRole([UserRole.ADMIN, UserRole.COMMITTEE])) {
          const [usersResp, bills, allIssues, visitors] = await Promise.all([
            apiService.getUsers(),
            apiService.getBills({ page: 1, limit: 1000 }),
            apiService.getIssues({ page: 1, limit: 1000 }),
            apiService.getVisitors({ page: 1, limit: 1000 })
          ]);

          console.log("👑 Admin/Committee - Users:", usersResp);
          console.log("💳 Admin/Committee - Bills:", bills);
          console.log("🔧 Admin/Committee - Issues:", allIssues);
          console.log("🚪 Admin/Committee - Visitors:", visitors);

          totalUsers = usersResp.data?.length || 0;
          totalBills = bills.length;
          pendingBills = bills.filter((b: any) => b.status === 'Pending').length;
          totalIssues = allIssues.length;
          pendingIssues = allIssues.filter((i: any) => i.status === 'open').length;
          totalVisitors = visitors.length;
          activeVisitors = visitors.filter((v: any) => !v.outTime).length;

          console.log("✅ Admin/Committee stats:", {
            totalUsers,
            totalBills,
            pendingBills,
            totalIssues,
            pendingIssues,
            totalVisitors,
            activeVisitors
          });
        }

        // ✅ RESIDENT/TENANT: See only their own data
        if (hasRole([UserRole.RESIDENT, UserRole.TENANT])) {
          const userId = user?._id;

          if (!userId) {
            throw new Error('User ID not found');
          }

          const [issues, bills, visitors] = await Promise.all([
            apiService.getIssues({ reporter: userId, page: 1, limit: 1000 }),
            apiService.getBills({ userId, page: 1, limit: 1000 }),
            apiService.getVisitors({ flatNumber: user?.flatNumber, page: 1, limit: 1000 }),
          ]);

          console.log("🏠 Resident/Tenant - Issues:", issues);
          console.log("💳 Resident/Tenant - Bills:", bills);
          console.log("🚪 Resident/Tenant - Visitors:", visitors);

          totalIssues = issues.length;
          totalBills = bills.length;
          pendingBills = bills.filter((b: any) => b.status === 'Pending').length;
          totalVisitors = visitors.length;
          activeVisitors = visitors.filter((v: any) => !v.outTime).length;

          console.log("✅ Resident/Tenant stats:", {
            totalIssues,
            totalBills,
            pendingBills,
            totalVisitors,
            activeVisitors
          });
        }

        // ✅ Set final stats
        setStats({
          totalUsers,
          totalBills,
          pendingBills,
          totalVisitors,
          activeVisitors,
          totalIssues,
          pendingIssues,
          recentNotices: noticesResp.data || [],
          recentIssues: recentIssues || []
        });

        console.log("📈 Final dashboard stats:", {
          totalUsers,
          totalBills,
          pendingBills,
          totalVisitors,
          activeVisitors,
          totalIssues,
          pendingIssues
        });

      } catch (error: any) {
        console.error("❌ Dashboard fetch error:", error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ Only fetch if user is available
    if (user) {
      fetchDashboardData();
    }
  }, [user, hasRole]); // ✅ Proper dependencies

  const getRoleBasedStats = () => {
    if (hasRole([UserRole.ADMIN, UserRole.COMMITTEE])) {
      return [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Total Issues', value: stats.totalIssues, icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { title: 'Total Bills', value: stats.totalBills, icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Total Visitors', value: stats.totalVisitors, icon: UserCheck, color: 'text-purple-600', bgColor: 'bg-purple-100' }
      ];
    } else if (hasRole([UserRole.RESIDENT, UserRole.TENANT])) {
      return [
        { title: 'My Issues', value: stats.totalIssues, icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { title: 'My Bills', value: stats.totalBills, icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Pending Bills', value: stats.pendingBills, icon: Clock, color: 'text-red-600', bgColor: 'bg-red-100' },
        { title: 'My Visitors', value: stats.totalVisitors, icon: UserCheck, color: 'text-purple-600', bgColor: 'bg-purple-100' }
      ];
    } else if (hasRole([UserRole.SECURITY])) {
      return [
        { title: "Today's Visitors", value: stats.totalVisitors, icon: UserCheck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { title: 'Active Visitors', value: stats.activeVisitors, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      ];
    }

    return [];
  };

  // ✅ Show error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-primary-100">Here's what's happening in your society today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getRoleBasedStats().map((stat, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Notices & Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notices */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Recent Notices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
              {stats.recentNotices.length > 0 ? (
                stats.recentNotices.map((notice, i) => (
                  <div key={i} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-medium text-gray-900">{notice.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(notice.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 flex-1 flex items-center justify-center">No recent notices</p>
              )}
              <Link href="/notices">
                <Button variant="outline" className="w-full mt-auto">View All Notices</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Recent Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
              {stats.recentIssues.length > 0 ? (
                stats.recentIssues.map((issue, i) => (
                  <div key={i} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                    </div>
                    <Badge variant={issue.status === 'open' ? 'warning' : issue.status === 'resolved' ? 'success' : 'info'}>
                      {issue.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 flex-1 flex items-center justify-center">No recent issues</p>
              )}
              <Link href="/issues">
                <Button variant="outline" className="w-full mt-auto">View All Issues</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
