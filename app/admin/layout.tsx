'use client';

import { useAdmin, AdminProvider } from '@/lib/cms/admin-context';
import LoginForm from '@/components/cms/login-form';
import CMSLayout from '@/components/cms/cms-layout';
import { Card, CardContent } from '@/components/ui/card';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, cmsUser, loading, isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // All authenticated users have access

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminContent>{children}</AdminContent>
    </AdminProvider>
  );
}