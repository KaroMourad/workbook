import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhJMmEqbS9bAKWr8UhMgRtsLux253oKPY",
    authDomain: "workbook-f9da2.firebaseapp.com",
    projectId: "workbook-f9da2",
    storageBucket: "workbook-f9da2.appspot.com",
    messagingSenderId: "932569571057",
    appId: "1:932569571057:web:d14ba0d6164c0086169350"
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
