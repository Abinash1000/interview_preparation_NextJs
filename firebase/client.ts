// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCdCkDJCziNer-8bWzove-84NDO0vVAKE",
  authDomain: "interviewpreparation-9d2f1.firebaseapp.com",
  projectId: "interviewpreparation-9d2f1",
  storageBucket: "interviewpreparation-9d2f1.firebasestorage.app",
  messagingSenderId: "1004134552699",
  appId: "1:1004134552699:web:ffca65c14d948caf337ede",
  measurementId: "G-0K07NL4L8F"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);