// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBepVSIRrJDQe8l7V62lD8RsiLwBHWRXOY",
    authDomain: "anjana-dfd40.firebaseapp.com",
    projectId: "anjana-dfd40",
    storageBucket: "anjana-dfd40.firebasestorage.app",
    messagingSenderId: "910962347",
    appId: "1:910962347:web:4e17711dd216234391d1ee",
    measurementId: "G-ES9WM5YPM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
