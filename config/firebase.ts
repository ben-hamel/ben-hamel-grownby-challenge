// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYysKBHgbbFHqsF0V62mCjhA5SCGDTN84",
  authDomain: "grownby-ea510.firebaseapp.com",
  projectId: "grownby-ea510",
  storageBucket: "grownby-ea510.appspot.com",
  messagingSenderId: "286386860885",
  appId: "1:286386860885:web:7d3142bc46c73e6152b5dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
export { auth, db };
