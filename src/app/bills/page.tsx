'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Bill, PaymentStatus, UserRole } from '@/types';
import { apiService } from '@/services/api';
import { Plus, Search, CreditCard, DollarSign, Calendar, Download } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BillsPage() {
  const { user, hasPermission } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    gatewayRef: ''
  });
  const [generateFormData, setGenerateFormData] = useState({
    billingPeriodStart: '',
    billingPeriodEnd: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: PaymentStatus.PENDING, label: 'Pending' },
    { value: PaymentStatus.COMPLETED, label: 'Completed' },
    { value: PaymentStatus.FAILED, label: 'Failed' },
    { value: PaymentStatus.REFUNDED, label: 'Refunded' }
  ];

  useEffect(() => {
    if (!hasPermission('bills:read')) {
      return;
    }
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getBills();
      setBills(response.data);
    } catch (error) {
      toast.error('Failed to fetch bills');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;
    
    try {
      await apiService.payBill(
        selectedBill._id,
        Number(formData.amount),
        formData.gatewayRef
      );
      toast.success('Payment processed successfully');
      setShowPayModal(false);
      resetForm();
      fetchBills();
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  const handleGenerateBills = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.generateBills(
        generateFormData.billingPeriodStart,
        generateFormData.billingPeriodEnd
      );
      toast.success('Bills generated successfully');
      setShowGenerateModal(false);
      resetGenerateForm();
      fetchBills();
    } catch (error) {
      toast.error('Failed to generate bills');
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      gatewayRef: ''
    });
  };

  const resetGenerateForm = () => {
    setGenerateFormData({
      billingPeriodStart: '',
      billingPeriodEnd: ''
    });
  };

  const openPayModal = (bill: Bill) => {
    setSelectedBill(bill);
    setFormData({
      amount: bill.amount.toString(),
      gatewayRef: ''
    });
    setShowPayModal(true);
  };

  const filteredBills = (bills || []).filter(bill => {
  const matchesSearch =
    bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.user.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = !statusFilter || bill.status === statusFilter;

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

  const getTotalStats = () => {
  const safeBills = bills || []; // fallback to empty array
  const totalBills = safeBills.length;
  const pendingBills = safeBills.filter(bill => bill.status === PaymentStatus.PENDING).length;
  const totalAmount = safeBills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = safeBills
    .filter(bill => bill.status === PaymentStatus.PENDING)
    .reduce((sum, bill) => sum + bill.amount, 0);

  return { totalBills, pendingBills, totalAmount, pendingAmount };
};


  if (!hasPermission('bills:read')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <div className="flex space-x-2">
            {hasPermission('bills:write') && (
              <Button onClick={() => setShowGenerateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Bills
              </Button>
            )}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bills</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBills}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
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
                  <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bills ({filteredBills.length})</CardTitle>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {bill.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{bill.user.name}</p>
                            <p className="text-sm text-gray-500">{bill.user.flatNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{bill.description}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(bill.amount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(bill.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {bill.status === PaymentStatus.PENDING && hasPermission('bills:write') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPayModal(bill)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pay Bill Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Pay Bill"
        size="md"
      >
        {selectedBill && (
          <form onSubmit={handlePayBill} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Bill Details</h3>
              <p><strong>User:</strong> {selectedBill.user.name}</p>
              <p><strong>Description:</strong> {selectedBill.description}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedBill.amount)}</p>
              <p><strong>Due Date:</strong> {formatDate(selectedBill.dueDate)}</p>
            </div>

            <Input
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter payment amount"
              required
            />

            <Input
              label="Gateway Reference"
              value={formData.gatewayRef}
              onChange={(e) => setFormData(prev => ({ ...prev, gatewayRef: e.target.value }))}
              placeholder="Enter payment gateway reference"
              required
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Process Payment</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Generate Bills Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Bills"
        size="md"
      >
        <form onSubmit={handleGenerateBills} className="space-y-4">
          <Input
            label="Billing Period Start"
            type="date"
            value={generateFormData.billingPeriodStart}
            onChange={(e) => setGenerateFormData(prev => ({ ...prev, billingPeriodStart: e.target.value }))}
            required
          />

          <Input
            label="Billing Period End"
            type="date"
            value={generateFormData.billingPeriodEnd}
            onChange={(e) => setGenerateFormData(prev => ({ ...prev, billingPeriodEnd: e.target.value }))}
            required
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Generate Bills</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
