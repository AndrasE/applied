// Import the functions you need from the SDKs you need
// Make sure you have 'firebase' installed and its type definitions.
// If you encounter errors about missing types, you might need:
// npm install @types/firebase --save-dev (though modern firebase includes types)
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { FirebaseOptions } from "@firebase/app"; // For explicit type hinting on firebaseConfig

// Your web app's Firebase configuration
// We define firebaseConfig as FirebaseOptions for strong type checking.
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebaseexplicitly type the 'app' constant as FirebaseApp
const app: FirebaseApp = initializeApp(firebaseConfig);

export { app };
