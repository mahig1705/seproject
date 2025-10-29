'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Payment, PaymentStatus } from '@/types';
import { apiService } from '@/services/api';
import { Search, CreditCard, Download, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const { hasPermission } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: PaymentStatus.PENDING, label: 'Pending' },
    { value: PaymentStatus.COMPLETED, label: 'Completed' },
    { value: PaymentStatus.FAILED, label: 'Failed' },
    { value: PaymentStatus.REFUNDED, label: 'Refunded' }
  ];

  useEffect(() => {
    if (!hasPermission('payments:read')) {
      return;
    }
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPayments();
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = (payments || []).filter(payment => {
  const matchesSearch =
    payment.bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.bill.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = !statusFilter || payment.status === statusFilter;

  return matchesSearch && matchesStatus;
});


  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'warning';
      case PaymentStatus.COMPLETED:
        return 'success';
      case PaymentStatus.FAILED:
        return 'danger';
      case PaymentStatus.REFUNDED:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case PaymentStatus.FAILED:
        return <XCircle className="w-4 h-4" />;
      case PaymentStatus.REFUNDED:
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTotalStats = () => {
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED).length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedAmount = payments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return { totalPayments, completedPayments, totalAmount, completedAmount };
  };

  if (!hasPermission('payments:read')) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  const stats = getTotalStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedPayments}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.completedAmount)}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Bill Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Gateway Ref</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {payment.bill.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{payment.bill.user.name}</p>
                            <p className="text-sm text-gray-500">{payment.bill.user.flatNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{payment.bill.description}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 font-mono">
                          {payment.gatewayRef}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{payment.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(payment.createdAt)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {filteredPayments.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">No payments match your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
