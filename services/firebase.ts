// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if we have the minimum required config
const isConfigAvailable = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (!isConfigAvailable && import.meta.env.PROD) {
    console.error("Firebase configuration is missing! Please set your environment variables in Vercel.");
}

// Initialize Firebase only if config is present and not already initialized
const app = isConfigAvailable
    ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
    : null;

const analytics = app ? getAnalytics(app) : null;
export const db = app ? getFirestore(app) : null;

export default app;

