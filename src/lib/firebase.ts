
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "dispatchconnect-7nqgs",
  "appId": "1:62107898456:web:970d8ab576daea024c702d",
  "storageBucket": "dispatchconnect-7nqgs.appspot.com",
  "apiKey": "AIzaSyCOgzV3hrbrehFw1eKAPuEwvo6uxN6E1rI",
  "authDomain": "dispatchconnect-7nqgs.firebaseapp.com",
  "messagingSenderId": "62107898456",
  "measurementId": "G-L8P2K1V8B2"
};

// Initialize Firebase
let app, auth, db, storage;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create dummy objects for development
  auth = {
    onAuthStateChanged: (callback: any) => {
      callback(null); // No user
      return () => {};
    },
    signOut: async () => {},
  };
  db = {};
  storage = {};
}

export { app, auth, db, storage };
