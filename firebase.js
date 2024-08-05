// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrRxxhL3fkmQRs0YH4DpSsd2ukc90IQfw",
  authDomain: "inventory-4cd99.firebaseapp.com",
  projectId: "inventory-4cd99",
  storageBucket: "inventory-4cd99.appspot.com",
  messagingSenderId: "405000139538",
  appId: "1:405000139538:web:896ed8b9e90610f06ff9cb",
  measurementId: "G-PS6GZYC91J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}