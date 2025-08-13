// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC2Xy_JnLAfZ_q6CRfTGJcpH30A1LiDo4",
  authDomain: "todo-list-f7f42.firebaseapp.com",
  projectId: "todo-list-f7f42",
  storageBucket: "todo-list-f7f42.firebasestorage.app",
  messagingSenderId: "1043458066999",
  appId: "1:1043458066999:web:6f9fffed79b5ff20a5cdb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const dbFirestore = getFirestore(app);

export { auth, provider, dbFirestore };
export const db = getDatabase(app);