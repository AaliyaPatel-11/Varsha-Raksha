// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl383OOfL8kRB1_ml5coLputoS1YxTUpE",
  authDomain: "varsharaksha-c1bda.firebaseapp.com",
  projectId: "varsharaksha-c1bda",
  storageBucket: "varsharaksha-c1bda.firebasestorage.app",
  messagingSenderId: "800822204961",
  appId: "1:800822204961:web:03ae804121ba272d90a160",
  measurementId: "G-M714K1VNSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);