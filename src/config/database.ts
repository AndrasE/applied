// src/config/database.ts
import { getDatabase } from "firebase/database";
import { app } from "./firebase";

// Use the env variable for the database URL
const databaseURL = import.meta.env.VITE_FIREBASE_DB_URL;

const database = getDatabase(app, databaseURL);

export { database };
