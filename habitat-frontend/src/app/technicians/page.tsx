'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Technician } from '@/types';
import { apiService } from '@/services/api';
import { Plus, Search, Edit, Trash2, Wrench, Phone, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TechniciansPage() {
  const { hasPermission } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    specializations: [] as string[],
    availability: ''
  });
  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    if (!hasPermission('technicians:read')) {
      return;
    }
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
  try {
    setIsLoading(true);
    const response = await apiService.getTechnicians();
    setTechnicians(response);
  } catch (error) {
    toast.error('Failed to fetch technicians');
  } finally {
    setIsLoading(false);
  }
};


  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createTechnician(formData);
      toast.success('Technician created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchTechnicians();
    } catch (error) {
      toast.error('Failed to create technician');
    }
  };

  const handleEditTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechnician) return;
    
    try {
      await apiService.updateTechnician(selectedTechnician._id, formData);
      toast.success('Technician updated successfully');
      setShowEditModal(false);
      setSelectedTechnician(null);
      resetForm();
      fetchTechnicians();
    } catch (error) {
      toast.error('Failed to update technician');
    }
  };

  const handleDeleteTechnician = async (technicianId: string) => {
    if (!confirm('Are you sure you want to delete this technician?')) return;
    
    try {
      await apiService.deleteTechnician(technicianId);
      toast.success('Technician deleted successfully');
      fetchTechnicians();
    } catch (error) {
      toast.error('Failed to delete technician');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      specializations: [],
      availability: ''
    });
    setNewSpecialization('');
  };

  const openEditModal = (technician: Technician) => {
    setSelectedTechnician(technician);
    setFormData({
      name: technician.name,
      contact: technician.contact,
      specializations: technician.specializations,
      availability: technician.availability
    });
    setShowEditModal(true);
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const filteredTechnicians = (technicians || []).filter(technician => {
  const matchesSearch =
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.specializations.some(spec =>
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return matchesSearch;
});


  if (!hasPermission('technicians:read')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
          {hasPermission('technicians:write') && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Technician
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Technicians Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Technicians ({filteredTechnicians.length})</CardTitle>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnicians.map((technician) => (
                    <TableRow key={technician._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-primary-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{technician.name}</p>
                            <p className="text-sm text-gray-500">
                              Added: {formatDate(technician.createdAt)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{technician.contact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {technician.specializations.map((spec, index) => (
                            <Badge key={index} variant="info" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{technician.availability}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={technician.isActive ? 'success' : 'default'}>
                          {technician.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hasPermission('technicians:write') && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(technician)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTechnician(technician._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {filteredTechnicians.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
              <p className="text-gray-600">Add your first technician to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Technician Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Technician"
        size="lg"
      >
        <form onSubmit={handleCreateTechnician} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter technician name"
            required
          />
          
          <Input
            label="Contact"
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            placeholder="Enter contact number or email"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Specializations
            </label>
            <div className="flex space-x-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Enter specialization"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization} variant="outline">
                Add
              </Button>
            </div>
            {formData.specializations.length > 0 && (
              <div className="space-y-1">
                {formData.specializations.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{spec}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSpecialization(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Textarea
            label="Availability"
            value={formData.availability}
            onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
            placeholder="e.g., Monday-Friday 9AM-6PM, Weekends 10AM-4PM"
            rows={3}
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
            <Button type="submit">Create Technician</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Technician Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Technician"
        size="lg"
      >
        <form onSubmit={handleEditTechnician} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Contact"
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Specializations
            </label>
            <div className="flex space-x-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Enter specialization"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization} variant="outline">
                Add
              </Button>
            </div>
            {formData.specializations.length > 0 && (
              <div className="space-y-1">
                {formData.specializations.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{spec}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSpecialization(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Textarea
            label="Availability"
            value={formData.availability}
            onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
            rows={3}
            required
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Technician</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
