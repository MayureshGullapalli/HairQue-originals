//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCcKh2TD0hV2yq5Pvf_PvGUjP9hI8Z5Fwc",
  authDomain: "hairque-originals-71e10.firebaseapp.com",
  projectId: "hairque-originals-71e10",
  storageBucket: "hairque-originals-71e10.appspot.com",
  messagingSenderId: "550379231024",
  appId: "1:550379231024:web:3582e5e28ad44328cb9af5",
  measurementId: "G-WFXFNCVVGN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const FIRESTORE_DB = getFirestore(app)
export const auth = getAuth(app)

