import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCAM5iAwGcNL4lpI_0ZBquzQ4yPpfOzCFQ",
    authDomain: "servicios-181ca.firebaseapp.com",
    projectId: "servicios-181ca",
    storageBucket: "servicios-181ca.firebasestorage.app",
    messagingSenderId: "97331376175",
    appId: "1:97331376175:web:e5a9b93f2b89b2401156da"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, firebaseConfig };