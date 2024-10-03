// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAodAsheVbPTbTFq3g76RlHgEaKd2_s2gk",
  authDomain: "albatross-fe9a6.firebaseapp.com",
  projectId: "albatross-fe9a6",
  storageBucket: "albatross-fe9a6.appspot.com",
  messagingSenderId: "822176053533",
  appId: "1:822176053533:web:a3e3c8771f63bff1e189f4",
  measurementId: "G-KM23PNPM7X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
