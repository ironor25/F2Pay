import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbqyilRUS2wc9HXQsAiaEeIKo4Q5w7jt8",
  authDomain: "get-feedback-781ae.firebaseapp.com",
  projectId: "get-feedback-781ae",
  storageBucket: "get-feedback-781ae.firebasestorage.app",
  messagingSenderId: "50037107467",
  appId: "1:50037107467:web:ed12d602274321ad28900e",
  measurementId: "G-CBVKJSZV5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Firebase auth error:", error.code, error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Firebase login error:", error.code, error.message);
    throw error;
  }
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
