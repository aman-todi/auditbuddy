// firebase sdk
import { initializeApp } from "firebase/app";
// authentication
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app firebase config (currently connected to a test account)
const firebaseConfig = {
  apiKey: "AIzaSyAz_u7HjJhkORVS1ObcglowgX3e4l6HJQs",
  authDomain: "test-99d52.firebaseapp.com",
  projectId: "test-99d52",
  storageBucket: "test-99d52.appspot.com",
  messagingSenderId: "1097112274536",
  appId: "1:1097112274536:web:2840ba7f9e2be0c89a1ddd"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize authentication
export const auth = getAuth(app);


