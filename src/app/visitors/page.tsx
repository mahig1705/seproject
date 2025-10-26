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
import { Visitor, User } from '@/types';
import { apiService } from '@/services/api';
import { Plus, Search, UserCheck, Clock, CheckCircle } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VisitorsPage() {
  const { user, hasPermission } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    purpose: '',
    hostId: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'checked_out', label: 'Checked Out' }
  ];

  useEffect(() => {
    if (!hasPermission('visitors:read')) {
      return;
    }
    fetchVisitors();
    fetchUsers();
  }, []);

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getVisitors();
      setVisitors(response.data);
    } catch (error) {
      toast.error('Failed to fetch visitors');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createVisitor(formData);
      toast.success('Visitor logged successfully');
      setShowCreateModal(false);
      resetForm();
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to log visitor');
    }
  };

  const handleCheckoutVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitor) return;
    
    try {
      await apiService.checkoutVisitor(selectedVisitor._id, new Date().toISOString());
      toast.success('Visitor checked out successfully');
      setShowCheckoutModal(false);
      setSelectedVisitor(null);
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to checkout visitor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      vehicle: '',
      purpose: '',
      hostId: ''
    });
  };

  const openCheckoutModal = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setShowCheckoutModal(true);
  };

  const filteredVisitors = (visitors || []).filter(visitor => {
  const matchesSearch =
    visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.host?.name?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    !statusFilter ||
    (statusFilter === 'active' && !visitor.outTime) ||
    (statusFilter === 'checked_out' && visitor.outTime);

  return matchesSearch && matchesStatus;
});



  const getVisitorStatus = (visitor: Visitor) => {
    return visitor.outTime ? 'checked_out' : 'active';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'warning';
      case 'checked_out':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!hasPermission('visitors:read')) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
          {hasPermission('visitors:write') && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Visitor
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{(visitors || []).length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">
                  {(visitors || []).filter(v => !v.outTime).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Checked Out</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {visitors.filter(v => v.outTime).length}
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
              <div className="relative">
                <Input
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Visitors ({filteredVisitors.length})</CardTitle>
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
                    <TableHead>Visitor</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>In Time</TableHead>
                    <TableHead>Out Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {visitor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{visitor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {visitor.host.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{visitor.host.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{visitor.purpose}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {visitor.vehicle || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(visitor.inTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {visitor.outTime ? formatDateTime(visitor.outTime) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(getVisitorStatus(visitor))}>
                          {getVisitorStatus(visitor).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!visitor.outTime && hasPermission('visitors:write') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCheckoutModal(visitor)}
                          >
                            Checkout
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

      {/* Create Visitor Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Log New Visitor"
        size="lg"
      >
        <form onSubmit={handleCreateVisitor} className="space-y-4">
          <Input
            label="Visitor Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter visitor's full name"
            required
          />
          
          <Input
            label="Vehicle Number (Optional)"
            value={formData.vehicle}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
            placeholder="Enter vehicle number if applicable"
          />

          <Input
            label="Purpose of Visit"
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="e.g., Meeting, Delivery, etc."
            required
          />

          <Select
            label="Host"
            value={formData.hostId}
            onChange={(e) => setFormData(prev => ({ ...prev, hostId: e.target.value }))}
            options={[
              { value: '', label: 'Select Host' },
              ...users.map(user => ({
                value: user._id,
                label: `${user.name} (${user.flatNumber || 'N/A'})`
              }))
            ]}
            required
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Log Visitor</Button>
          </div>
        </form>
      </Modal>

      {/* Checkout Visitor Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Checkout Visitor"
        size="md"
      >
        {selectedVisitor && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Visitor Details</h3>
              <p><strong>Name:</strong> {selectedVisitor.name}</p>
              <p><strong>Host:</strong> {selectedVisitor.host.name}</p>
              <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
              <p><strong>In Time:</strong> {formatDateTime(selectedVisitor.inTime)}</p>
            </div>

            <form onSubmit={handleCheckoutVisitor}>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Checkout Visitor</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
