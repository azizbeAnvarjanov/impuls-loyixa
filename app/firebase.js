// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqfNS4jPUN8KklhP7oC_ZNeoJLSmWzr24",
  authDomain: "ta-minot.firebaseapp.com",
  projectId: "ta-minot",
  storageBucket: "ta-minot.firebasestorage.app",
  messagingSenderId: "990415642175",
  appId: "1:990415642175:web:717ac45e1773d25bd1628a",
};

// Firebase'ni ishga tushirish
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
