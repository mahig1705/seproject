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
import { Amenity } from '@/types';
import { apiService } from '@/services/api';
import { Plus, Search, Edit, Trash2, Home, Users, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AmenitiesPage() {
  const { hasPermission } = useAuth();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    rules: [] as string[]
  });
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    if (!hasPermission('amenities:read')) {
      return;
    }
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAmenities();
      setAmenities(response.data);
    } catch (error) {
      toast.error('Failed to fetch amenities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createAmenity({
        ...formData,
        capacity: Number(formData.capacity)
      });
      toast.success('Amenity created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchAmenities();
    } catch (error) {
      toast.error('Failed to create amenity');
    }
  };

  const handleEditAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmenity) return;
    
    try {
      await apiService.updateAmenity(selectedAmenity._id, {
        ...formData,
        capacity: Number(formData.capacity)
      });
      toast.success('Amenity updated successfully');
      setShowEditModal(false);
      setSelectedAmenity(null);
      resetForm();
      fetchAmenities();
    } catch (error) {
      toast.error('Failed to update amenity');
    }
  };

  const handleDeleteAmenity = async (amenityId: string) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;
    
    try {
      await apiService.deleteAmenity(amenityId);
      toast.success('Amenity deleted successfully');
      fetchAmenities();
    } catch (error) {
      toast.error('Failed to delete amenity');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: '',
      rules: []
    });
    setNewRule('');
  };

  const openEditModal = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setFormData({
  name: amenity.name || '',
  description: amenity.description || '',
  capacity: (amenity.capacity ?? '').toString(), // default to empty string if undefined
  rules: amenity.rules || []
});

    setShowEditModal(true);
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const filteredAmenities = (amenities || []).filter(amenity => {
  const matchesSearch =
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.description.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesSearch;
});

  if (!hasPermission('amenities:read')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Amenities</h1>
          {hasPermission('amenities:write') && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <Input
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            filteredAmenities.map((amenity) => (
              <Card key={amenity._id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Home className="w-5 h-5 text-primary-600" />
                      <span>{amenity.name}</span>
                    </CardTitle>
                    <Badge variant={amenity.isActive ? 'success' : 'default'}>
                      {amenity.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{amenity.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {amenity.capacity} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(amenity.createdAt)}</span>
                    </div>
                  </div>

                  {(amenity.rules || []).length > 0 && (
  <div className="mb-4">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Rules:</h4>
    <ul className="text-sm text-gray-600 space-y-1">
      {(amenity.rules || []).map((rule, index) => (
        <li key={index} className="flex items-start space-x-2">
          <span className="text-primary-600">•</span>
          <span>{rule}</span>
        </li>
      ))}
    </ul>
  </div>
)}

                  {hasPermission('amenities:write') && (
                    <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(amenity)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAmenity(amenity._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredAmenities.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No amenities found</h3>
              <p className="text-gray-600">Add your first amenity to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Amenity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Amenity"
        size="lg"
      >
        <form onSubmit={handleCreateAmenity} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter amenity name"
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter amenity description"
            rows={3}
            required
          />

          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            placeholder="Enter maximum capacity"
            min="1"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rules
            </label>
            <div className="flex space-x-2">
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Enter a rule"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
              />
              <Button type="button" onClick={addRule} variant="outline">
                Add
              </Button>
            </div>
            {formData.rules.length > 0 && (
              <div className="space-y-1">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{rule}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Amenity</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Amenity Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Amenity"
        size="lg"
      >
        <form onSubmit={handleEditAmenity} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />

          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            min="1"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rules
            </label>
            <div className="flex space-x-2">
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Enter a rule"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
              />
              <Button type="button" onClick={addRule} variant="outline">
                Add
              </Button>
            </div>
            {formData.rules.length > 0 && (
              <div className="space-y-1">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{rule}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Amenity</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
