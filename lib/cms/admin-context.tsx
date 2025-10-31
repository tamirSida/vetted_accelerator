'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { CMSUser } from '@/lib/types/cms';

interface AdminContextType {
  user: User | null;
  cmsUser: CMSUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAdminMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleAdminMode: () => void;
  refreshUserData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cmsUser, setCmsUser] = useState<CMSUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const isAdmin = Boolean(user); // Any authenticated user has admin access

  const refreshUserData = useCallback(async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'cms-users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<CMSUser, 'id'>;
          setCmsUser({ id: user.uid, ...userData });
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'cms-users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<CMSUser, 'id'>;
            setCmsUser({ id: firebaseUser.uid, ...userData });
          } else {
            // Create new CMS user document - auto-activate
            const newCmsUser: Omit<CMSUser, 'id'> = {
              email: firebaseUser.email || '',
              role: 'admin', // All authenticated users are admins
              isActive: true,
              createdAt: new Date(),
              lastLogin: new Date()
            };
            
            await setDoc(doc(db, 'cms-users', firebaseUser.uid), newCmsUser);
            setCmsUser({ id: firebaseUser.uid, ...newCmsUser });
          }
        } catch (error) {
          console.error('Error with CMS user:', error);
          setCmsUser(null);
        }
      } else {
        setCmsUser(null);
        setIsAdminMode(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []); // Empty dependency array - only run once

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAdminMode(false);
      // Redirect to home after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const value = {
    user,
    cmsUser,
    loading,
    isAdmin,
    isAdminMode,
    signIn,
    signOut,
    toggleAdminMode,
    refreshUserData
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}