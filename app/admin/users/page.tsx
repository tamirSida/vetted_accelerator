'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { userService } from '@/lib/cms/user-service';
import { CMSUser } from '@/lib/types/cms';
import { useAdmin } from '@/lib/cms/admin-context';
import { UserPlus, UserCheck, UserX, Shield, Edit, Mail, Lock } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function UsersAdminPage() {
  const { cmsUser } = useAdmin();
  const [users, setUsers] = useState<CMSUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'editor'
  });

  const isMainAdmin = cmsUser?.role === 'admin';

  const fetchUsers = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActivateUser = async (userId: string) => {
    if (!isMainAdmin) return;
    
    setLoading(true);
    try {
      await userService.activateUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!isMainAdmin) return;
    
    setLoading(true);
    try {
      await userService.deactivateUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, role: 'admin' | 'editor') => {
    if (!isMainAdmin) return;
    
    setLoading(true);
    try {
      await userService.updateUserRole(userId, role);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainAdmin) return;
    
    setLoading(true);
    try {
      // Create Firebase user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        createFormData.email, 
        createFormData.password
      );
      
      // Create CMS user record
      await userService.create({
        email: createFormData.email,
        role: createFormData.role,
        isActive: true,
        lastLogin: new Date()
      });
      
      // Reset form and refresh users
      setCreateFormData({ email: '', password: '', role: 'admin' });
      setShowCreateForm(false);
      await fetchUsers();
      
      alert('Admin account created successfully!');
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Error creating user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pendingUsers = users.filter(user => !user.isActive);
  const activeUsers = users.filter(user => user.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage CMS user access and permissions</p>
        </div>
        {isMainAdmin && (
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create New Admin
          </Button>
        )}
      </div>

      {/* Create User Form */}
      {showCreateForm && isMainAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) => setCreateFormData(prev => ({
                    ...prev,
                    role: e.target.value as 'admin' | 'editor'
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="editor">Editor (Content Only)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateFormData({ email: '', password: '', role: 'admin' });
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!isMainAdmin && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-yellow-800">
              You have editor permissions. Only admins can manage users.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pending Users */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Pending Approval ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Requested access on {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pending</Badge>
                    {isMainAdmin && (
                      <Button
                        onClick={() => handleActivateUser(user.id)}
                        disabled={loading}
                        size="sm"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Active Users ({activeUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                    {user.role === 'admin' ? 'Admin' : 'Editor'}
                  </Badge>
                  
                  {isMainAdmin && user.id !== cmsUser?.id && (
                    <>
                      {user.role === 'editor' && (
                        <Button
                          onClick={() => handleUpdateRole(user.id, 'admin')}
                          disabled={loading}
                          size="sm"
                          variant="outline"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </Button>
                      )}
                      
                      {user.role === 'admin' && (
                        <Button
                          onClick={() => handleUpdateRole(user.id, 'editor')}
                          disabled={loading}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Make Editor
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDeactivateUser(user.id)}
                        disabled={loading}
                        size="sm"
                        variant="destructive"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </Button>
                    </>
                  )}
                  
                  {user.id === cmsUser?.id && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Add New Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. New users need to first create a Firebase account by trying to access /admin</p>
            <p>2. Once they try to sign in, they'll appear in the "Pending Approval" section</p>
            <p>3. Approve them and set their role (Admin or Editor)</p>
            <p>4. Admins can manage users and content, Editors can only manage content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}