import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx2cdraOfMeWI8M_6ePApG9zEqaQXbG6o",
  authDomain: "mockai-51d75.firebaseapp.com",
  projectId: "mockai-51d75",
  storageBucket: "mockai-51d75.firebasestorage.app",
  messagingSenderId: "286580516421",
  appId: "1:286580516421:web:75846190f6218126b4e52c",
  measurementId: "G-Y1SX6CR71K"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);