// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbwI1guUVs5_fgkeerlqnn53W-KOOY_ZE",
  authDomain: "inventory-management-e1b4b.firebaseapp.com",
  projectId: "inventory-management-e1b4b",
  storageBucket: "inventory-management-e1b4b.appspot.com",
  messagingSenderId: "41137894229",
  appId: "1:41137894229:web:b3936547eea9117fadf5dc",
  measurementId: "G-XRC80GJY2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};