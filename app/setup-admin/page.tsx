'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfSetupComplete();
  }, []);

  const checkIfSetupComplete = async () => {
    try {
      // Check if there's already an admin user
      const adminDoc = await getDoc(doc(db, 'setup', 'admin-initialized'));
      if (adminDoc.exists()) {
        setIsSetupComplete(true);
        setMessage('Admin setup has already been completed. This page is no longer accessible.');
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create the admin user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to cms-users collection with admin role
      await setDoc(doc(db, 'cms-users', user.uid), {
        id: user.uid,
        email: user.email,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mark setup as complete
      await setDoc(doc(db, 'setup', 'admin-initialized'), {
        completed: true,
        completedAt: new Date(),
        adminUserId: user.uid
      });

      setMessage('Admin user created successfully! Redirecting to admin panel...');
      
      // Redirect to admin panel after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error: any) {
      console.error('Error setting up admin:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSetupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Setup Complete</h2>
            <p className="mt-4 text-gray-600">
              Admin setup has already been completed. This page is no longer accessible.
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="mt-6"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Setup Admin User</h2>
          <p className="mt-4 text-gray-600">
            Create the first admin user for your CMS. This page will be disabled after setup.
          </p>
        </div>

        <form onSubmit={handleSetupAdmin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Choose a strong password"
              minLength={6}
            />
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Setting up...' : 'Create Admin User'}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>⚠️ This is a one-time setup page that will be disabled after use.</p>
          <p>Make sure to save your credentials securely.</p>
        </div>
      </div>
    </div>
  );
}