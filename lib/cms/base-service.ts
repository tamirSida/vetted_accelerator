import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export abstract class BaseFirestoreService<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.getCollection(), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(this.getCollection(), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      // Use setDoc with merge to create the document if it doesn't exist
      await setDoc(docRef, {
        ...data,
        id,
        updatedAt: new Date(),
        createdAt: new Date() // Will be ignored if document exists due to merge
      }, { merge: true });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getVisible(limit?: number): Promise<T[]> {
    const allItems = await this.getAll();
    const visibleItems = allItems
      .filter(item => (item as any).isVisible === true)
      .sort((a, b) => ((a as any).order || 0) - ((b as any).order || 0));
    
    return limit ? visibleItems.slice(0, limit) : visibleItems;
  }

  async updateOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      const updatePromises = items.map(item => 
        this.update(item.id, { order: item.order } as unknown as Partial<T>)
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error(`Error updating ${this.collectionName} order:`, error);
      throw error;
    }
  }
}