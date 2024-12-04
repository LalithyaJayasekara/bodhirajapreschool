import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp as firestoreServerTimestamp } from "firebase/firestore"; // Importing serverTimestamp
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwZDeffdatTU86XfKecUUTnbLcwQ-O504",
  authDomain: "preschooldbbodhiraja.firebaseapp.com",
  projectId: "preschooldbbodhiraja",
  storageBucket: "preschooldbbodhiraja.appspot.com",
  messagingSenderId: "333077417842",
  appId: "1:333077417842:web:5ac0f4ef89f64d122257eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporting Firestore's serverTimestamp function
export { db, auth, storage, firestoreServerTimestamp as serverTimestamp }; 
