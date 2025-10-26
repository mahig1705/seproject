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
import { Booking, Amenity, Technician, BookingStatus, UserRole } from '@/types';
import { apiService } from '@/services/api';
import { Plus, Search, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const { user, hasPermission } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    amenityId: '',
    startTime: '',
    endTime: '',
    technicianId: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: BookingStatus.PENDING, label: 'Pending' },
    { value: BookingStatus.APPROVED, label: 'Approved' },
    { value: BookingStatus.REJECTED, label: 'Rejected' },
    { value: BookingStatus.CANCELLED, label: 'Cancelled' }
  ];

  useEffect(() => {
    if (!hasPermission('bookings:read')) {
      return;
    }
    fetchBookings();
    fetchAmenities();
    fetchTechnicians();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await apiService.getAmenities();
      setAmenities(response.data);
    } catch (error) {
      console.error('Failed to fetch amenities:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await apiService.getTechnicians();
      setTechnicians(response.data);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createBooking(formData);
      toast.success('Booking created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchBookings();
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  const handleApproveBooking = async (status: BookingStatus) => {
    if (!selectedBooking) return;
    
    try {
      await apiService.approveBooking(selectedBooking._id, status);
      toast.success(`Booking ${status} successfully`);
      setShowApproveModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
    }
  };

  const resetForm = () => {
    setFormData({
      amenityId: '',
      startTime: '',
      endTime: '',
      technicianId: ''
    });
  };

  const openApproveModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowApproveModal(true);
  };

  const filteredBookings = (bookings || []).filter(booking => {
  const matchesSearch =
    booking.amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = !statusFilter || booking.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'warning';
      case BookingStatus.APPROVED:
        return 'success';
      case BookingStatus.REJECTED:
        return 'danger';
      case BookingStatus.CANCELLED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case BookingStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />;
      case BookingStatus.REJECTED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (!hasPermission('bookings:read')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          {hasPermission('bookings:write') && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
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
                    <TableHead>Amenity</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {booking.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{booking.user.name}</p>
                            <p className="text-sm text-gray-500">{booking.user.flatNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          <span className="font-medium text-gray-900">{booking.amenity.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(booking.startTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(booking.endTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {booking.technician ? booking.technician.name : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(booking.status)}
                            <span>{booking.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.status === BookingStatus.PENDING && hasPermission('bookings:write') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openApproveModal(booking)}
                          >
                            Review
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

      {/* Create Booking Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Booking"
        size="lg"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <Select
            label="Amenity"
            value={formData.amenityId}
            onChange={(e) => setFormData(prev => ({ ...prev, amenityId: e.target.value }))}
            options={[
              { value: '', label: 'Select Amenity' },
              ...amenities.map(amenity => ({
                value: amenity._id,
                label: amenity.name
              }))
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            />
            <Input
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              required
            />
          </div>

          <Select
            label="Technician (Optional)"
            value={formData.technicianId}
            onChange={(e) => setFormData(prev => ({ ...prev, technicianId: e.target.value }))}
            options={[
              { value: '', label: 'No Technician Required' },
              ...technicians.map(technician => ({
                value: technician._id,
                label: technician.name
              }))
            ]}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Booking</Button>
          </div>
        </form>
      </Modal>

      {/* Approve Booking Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Review Booking"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
              <p><strong>User:</strong> {selectedBooking.user.name}</p>
              <p><strong>Amenity:</strong> {selectedBooking.amenity.name}</p>
              <p><strong>Start Time:</strong> {formatDateTime(selectedBooking.startTime)}</p>
              <p><strong>End Time:</strong> {formatDateTime(selectedBooking.endTime)}</p>
              {selectedBooking.technician && (
                <p><strong>Technician:</strong> {selectedBooking.technician.name}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleApproveBooking(BookingStatus.REJECTED)}
                className="text-red-600 hover:text-red-700"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleApproveBooking(BookingStatus.APPROVED)}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
