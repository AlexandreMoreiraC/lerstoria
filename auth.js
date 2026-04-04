// auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// CRIAR CONTA
export const signUp = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Cria o documento do usuário no banco de dados com progresso zerado
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            history: [],
            favorites: [],
            quizzes: {}
        });
        return user;
    } catch (error) {
        throw error;
    }
};

// LOGAR
export const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// DESLOGAR
export const logout = () => signOut(auth);