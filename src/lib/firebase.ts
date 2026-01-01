import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCHvWLf2jxXeho5_IGoaumpz-XrC7XliE8",
  authDomain: "ecommerce-9c4d2.firebaseapp.com",
  projectId: "ecommerce-9c4d2",
  storageBucket: "ecommerce-9c4d2.appspot.com",
  messagingSenderId: "470497224974",
  appId: "1:470497224974:web:da50fd914e52da61570f5f",
  measurementId: "G-2WY2PV7S4V"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, googleProvider, analytics };
