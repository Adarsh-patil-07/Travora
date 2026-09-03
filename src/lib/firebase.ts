import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-li0ryuqUjFQ1IbJwdjvBA8rthUtYstk",
  authDomain: "travora-ai.firebaseapp.com",
  projectId: "travora-ai",
  storageBucket: "travora-ai.firebasestorage.app",
  messagingSenderId: "954459538029",
  appId: "1:954459538029:web:e895dd327a5e307ca0f564"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
