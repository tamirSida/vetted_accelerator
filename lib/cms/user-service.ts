import { BaseFirestoreService } from './base-service';
import { CMSUser } from '@/lib/types/cms';
import { doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export class UserService extends BaseFirestoreService<CMSUser> {
  constructor() {
    super('cms-users');
  }

  async getAllUsers(): Promise<CMSUser[]> {
    return this.getAll();
  }

  async activateUser(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, userId), {
        isActive: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, userId), {
        isActive: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: 'admin' | 'editor'): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, userId), {
        role,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async getPendingUsers(): Promise<CMSUser[]> {
    const allUsers = await this.getAll();
    return allUsers.filter(user => user.isActive === false);
  }

  async getActiveUsers(): Promise<CMSUser[]> {
    const allUsers = await this.getAll();
    return allUsers.filter(user => user.isActive === true);
  }
}

// Singleton instance
export const userService = new UserService();