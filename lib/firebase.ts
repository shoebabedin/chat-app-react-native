import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAuECq9LLCQfqC4c5tR5HPf4BX8xSCnsNA",
  authDomain: "lawyer-c179e.firebaseapp.com",
  projectId: "lawyer-c179e",
  storageBucket: "lawyer-c179e.firebasestorage.app",
  messagingSenderId: "570856385645",
  appId: "1:570856385645:web:906f0ae4012c65b8fa2364",
  measurementId: "G-44FBNF3WDD"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

