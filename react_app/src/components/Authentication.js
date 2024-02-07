// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFLyEemhNfxcMtrY1dvzA4mfy7Xqb-9Lg",
  authDomain: "valued-range-411422.firebaseapp.com",
  projectId: "valued-range-411422",
  storageBucket: "valued-range-411422.appspot.com",
  messagingSenderId: "910714431854",
  appId: "1:910714431854:web:c69740781298268552397f",
  measurementId: "G-9X6VSBJY3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// initialize authentication
export const auth = getAuth(app);