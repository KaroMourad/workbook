import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";

const {
    REACT_APP_API_KEY,
    REACT_APP_AUTH_DOMAIN,
    REACT_APP_PROJECT_ID,
    REACT_APP_STORAGE_BUCKET,
    REACT_APP_MESSAGING_SENDER_ID,
    REACT_APP_APP_ID
} = process.env;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: `${REACT_APP_API_KEY}`,
    authDomain: `${REACT_APP_AUTH_DOMAIN}`,
    projectId: `${REACT_APP_PROJECT_ID}`,
    storageBucket: `${REACT_APP_STORAGE_BUCKET}`,
    messagingSenderId: `${REACT_APP_MESSAGING_SENDER_ID}`,
    appId: `${REACT_APP_APP_ID}`
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
