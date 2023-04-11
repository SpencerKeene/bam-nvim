import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFhfYWI3BGzNIT9lm9A3-uhjV0XCnd9iM",
  authDomain: "bamtoronto-nvim.firebaseapp.com",
  projectId: "bamtoronto-nvim",
  storageBucket: "bamtoronto-nvim.appspot.com",
  messagingSenderId: "587356339074",
  appId: "1:587356339074:web:ff53249bc1b900f6682d9b",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
