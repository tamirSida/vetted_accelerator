import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDYUjnO58n1w1NQjE7694ZkPOlWJnI_L4",
  authDomain: "alphabet-e9433.firebaseapp.com",
  projectId: "alphabet-e9433",
  storageBucket: "alphabet-e9433.firebasestorage.app",
  messagingSenderId: "421416400597",
  appId: "1:421416400597:web:b7acb6d94a47acbe53545c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);