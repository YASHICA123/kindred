// Firebase configuration for Next.js app
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAfZbPSMQpmi3EUQexROYzpB9UmezRxpbQ",
  authDomain: "kindred-c52ce.firebaseapp.com",
  projectId: "kindred-c52ce",
  storageBucket: "kindred-c52ce.firebasestorage.app",
  messagingSenderId: "310846675726",
  appId: "1:310846675726:web:a64e06c979f4e64385955f",
  measurementId: "G-BR30L8VPPC"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
