// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB38gKylZsqw6sCWJRcIqhyYm7dcLUIZJI",
  authDomain: "smoothsail-mvp.firebaseapp.com",
  projectId: "smoothsail-mvp",
  storageBucket: "smoothsail-mvp.firebasestorage.app",
  messagingSenderId: "909265753647",
  appId: "1:909265753647:web:204d9ca67ca21ff03b18da",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
