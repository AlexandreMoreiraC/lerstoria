import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_7PddGq8hLSi5HiHyH3n_3H1N1m4yiDg",
  authDomain: "lerstoria.firebaseapp.com",
  projectId: "lerstoria",
  storageBucket: "lerstoria.firebasestorage.app",
  messagingSenderId: "993956772933",
  appId: "1:993956772933:web:eaacb53f5fa70f7b24372c"
};

const app = initializeApp(firebaseConfig);

// Exportamos o auth e o db para usar nos outros arquivos
export const auth = getAuth(app);
export const db = getFirestore(app);