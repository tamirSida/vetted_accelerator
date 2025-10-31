'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { Button } from '@/components/ui/button';
import { Settings, Lock, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function SimpleAdminToggle() {
  const { isAdmin, isAdminMode, toggleAdminMode, signOut, user } = useAdmin();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex gap-2">
      <Button
        onClick={toggleAdminMode}
        variant={isAdminMode ? "destructive" : "outline"}
        size="sm"
        className="shadow-lg"
      >
        {isAdminMode ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Exit Edit Mode
          </>
        ) : (
          <>
            <Settings className="h-4 w-4 mr-2" />
            Edit Mode
          </>
        )}
      </Button>
      
      <Button
        onClick={() => window.location.href = '/admin'}
        variant="outline"
        size="sm"
        className="shadow-lg"
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Dashboard
      </Button>
      
      <Button
        onClick={() => signOut()}
        variant="outline"
        size="sm"
        className="shadow-lg"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}