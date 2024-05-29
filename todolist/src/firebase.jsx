// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGFC5jEMk2xtCxRW3Tp-DhqOdwc2rYMYQ",
  authDomain: "todolist1-c2cc4.firebaseapp.com",
  projectId: "todolist1-c2cc4",
  storageBucket: "todolist1-c2cc4.appspot.com",
  messagingSenderId: "288884869660",
  appId: "1:288884869660:web:8318ca4a1e137f7a4e6dd9",
  measurementId: "G-L396GC45YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore(app);
export default app;


