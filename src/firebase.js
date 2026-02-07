import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFQce_3FcJK5yrs7gb1lLy8_11itDWCrI",
  authDomain: "exploreph-274e4.firebaseapp.com",
  projectId: "exploreph-274e4",
  storageBucket: "exploreph-274e4.appspot.com", // 🔥 FIXED storage domain
  messagingSenderId: "719020077812",
  appId: "1:719020077812:web:949314aaf2c2965ed864a1",
  measurementId: "G-YN6R095R37",
};

const app = initializeApp(firebaseConfig);

// Export all Firebase services used in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
