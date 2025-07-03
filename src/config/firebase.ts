// Import Firebase core and required services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and Database services
const auth = getAuth(app);
const database = getDatabase(app);

// Export initialized Firebase services for use in the app
export { app, auth, database };
