import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-vA3aDPKUvo3p2zRRi-_YjMaJ3ZNaQew",
  authDomain: "urgarden-e644e.firebaseapp.com",
  databaseURL:
    "https://urgarden-e644e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "urgarden-e644e",
  storageBucket: "urgarden-e644e.firebasestorage.app",
  messagingSenderId: "1085154163383",
  appId: "1:1085154163383:web:542f352d11040c7e9fab32",
  measurementId: "G-2EQJDSNHFB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = initializeAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage, firebaseConfig };
