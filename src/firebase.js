import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAEO3-04LwMpShZTt3SvqJmg7T2NqjsP4",
  authDomain: "valet-cd4f2.firebaseapp.com",
  projectId: "valet-cd4f2",
  storageBucket: "valet-cd4f2.appspot.com",
  messagingSenderId: "468811015691",
  appId: "1:468811015691:web:045cab16b8260f38a3490e",
  measurementId: "G-5NG3ZJG9PE",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = app.firestore();

export { auth, db };
