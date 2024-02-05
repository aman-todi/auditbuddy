// firebase sdk
import { initializeApp } from "firebase/app";
// authentication
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app firebase config (currently connected to a test account)
const firebaseConfig = {
  apiKey: "AIzaSyCFLyEemhNfxcMtrY1dvzA4mfy7Xqb-9Lg",
  authDomain: "valued-range-411422.firebaseapp.com",
  projectId: "valued-range-411422",
  storageBucket: "valued-range-411422.appspot.com",
  messagingSenderId: "910714431854",
  appId: "1:910714431854:web:c69740781298268552397f",
  measurementId: "G-9X6VSBJY3C"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize authentication
export const auth = getAuth(app);
