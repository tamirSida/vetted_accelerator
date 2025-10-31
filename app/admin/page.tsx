'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { userService } from '@/lib/cms/user-service';
import { CMSUser } from '@/lib/types/cms';
import { useAdmin } from '@/lib/cms/admin-context';
import { UserPlus, UserCheck, UserX, Shield, Edit, Eye } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';

export default function AdminDashboard() {
  const { cmsUser } = useAdmin();
  const [users, setUsers] = useState<CMSUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: ''
  });

  const isAdmin = Boolean(cmsUser); // Any authenticated user is admin

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

  const handleDeactivateUser = async (userId: string) => {
    if (!isAdmin) return;
    
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // Create Firebase user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        createFormData.email, 
        createFormData.password
      );
      
      // Create CMS user record - all users are admins
      await userService.create({
        email: createFormData.email,
        role: 'admin',
        isActive: true,
        lastLogin: new Date()
      });
      
      // Reset form and refresh users
      setCreateFormData({ email: '', password: '' });
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

  // Show all users since everyone is an admin

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage admin users and access</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Button>
          </Link>
          <Link href="/admin/files">
            <Button variant="outline" size="sm">
              <i className="fas fa-cloud mr-2"></i>
              File Manager
            </Button>
          </Link>
          {isAdmin && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Create New Admin
            </Button>
          )}
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm && isAdmin && (
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
                    setCreateFormData({ email: '', password: '' });
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

      {/* Admin Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                  
                  {isAdmin && user.id !== cmsUser?.id && (
                    <Button
                      onClick={() => handleDeactivateUser(user.id)}
                      disabled={loading}
                      size="sm"
                      variant="destructive"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
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
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• To edit website content, use the inline CMS on the live site</p>
            <p>• Click "View Site" then "Edit Mode" to modify content directly</p>
            <p>• Hover over sections to see edit options</p>
            <p>• This dashboard is only for user management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}