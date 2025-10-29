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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';
import { User, UserRole } from '@/types';

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.RESIDENT,
    flatNumber: '',
    password: '',
  });

  const roleOptions = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.COMMITTEE, label: 'Committee' },
    { value: UserRole.RESIDENT, label: 'Resident' },
    { value: UserRole.TENANT, label: 'Tenant' },
    { value: UserRole.SECURITY, label: 'Security' },
    { value: UserRole.TECHNICIAN, label: 'Technician' },
  ];

  useEffect(() => {
    if (hasPermission('users:read')) fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    console.log("🔍 Fetching users...");

    try {
      const res = await apiService.getUsers();
      console.log("✅ API response:", res);

      // If API returns { data, total, ... }
      if (res?.data) {
        setUsers(res.data);
        console.log("👥 Users loaded:", res.data.length);
      } else {
        console.warn("⚠️ Unexpected users response format:", res);
      }
    } catch (error: any) {
      console.error("❌ Failed to load users:", error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
      console.log("⏹️ Fetch users completed");
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: UserRole.RESIDENT,
      flatNumber: '',
      password: '',
    });
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Enter a valid email address');
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return false;
    }
    if (showCreateModal && !formData.password.trim()) {
      toast.error('Password is required for new users');
      return false;
    }
    return true;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  console.log("🚀 Sending user create request with data:", formData);

  try {
    // ✅ use the ApiService helper (which you’ll add below if missing)
    const res = await apiService.createUser(formData);
    console.log("✅ Create user response:", res);

    toast.success('User created successfully');
    setShowCreateModal(false);
    resetForm();
    fetchUsers();
  } catch (error: any) {
    console.error("❌ Failed to create user:", error?.response?.data || error);
    toast.error('Failed to create user');
  }
};


  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await apiService.updateUser(selectedUser?._id!, formData);
      toast.success('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await apiService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      flatNumber: user.flatNumber || '',
      password: '',
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'danger';
      case UserRole.COMMITTEE:
        return 'info';
      case UserRole.RESIDENT:
        return 'success';
      case UserRole.TENANT:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          {hasPermission('users:write') && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-4 grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[{ value: '', label: 'All Roles' }, ...roleOptions]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 border-2 border-primary-500 rounded-full border-t-transparent animate-spin mx-auto" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadge(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.flatNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'success' : 'danger'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} options={roleOptions} />
          <Input label="Flat Number" value={formData.flatNumber} onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <form onSubmit={handleEditUser} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })} options={roleOptions} />
          <Input label="Flat Number" value={formData.flatNumber} onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
