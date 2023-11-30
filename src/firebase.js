import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxiKvzxlgUAgW0L6i_AjEmmr61YOYYpEo",
  authDomain: "bostonvalet-6485d.firebaseapp.com",
  projectId: "bostonvalet-6485d",
  storageBucket: "bostonvalet-6485d.appspot.com",
  messagingSenderId: "181686680421",
  appId: "1:181686680421:web:99236a28f09f1e4b2bff8c",
  measurementId: "G-B4ZMSFJ6QZ",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = app.firestore();

export { auth, db };
