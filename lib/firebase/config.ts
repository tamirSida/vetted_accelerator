import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNIq_GENFLFe5iJ8kKU0FutoD5eVyOrEw",
  authDomain: "vetted-accelerator.firebaseapp.com",
  projectId: "vetted-accelerator",
  storageBucket: "vetted-accelerator.firebasestorage.app",
  messagingSenderId: "1039236686703",
  appId: "1:1039236686703:web:1150be6de7c690ba663e9a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);