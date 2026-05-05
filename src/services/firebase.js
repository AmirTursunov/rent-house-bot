import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYAlQeMHVzXSs8mPxBX17B8VqMwb1Daeo",
  authDomain: "house-f82d9.firebaseapp.com",
  projectId: "house-f82d9",
  storageBucket: "house-f82d9.firebasestorage.app",
  messagingSenderId: "407054391517",
  appId: "1:407054391517:web:c41e5ab6486a0bb5412334",
  measurementId: "G-6JKKEY95DC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
