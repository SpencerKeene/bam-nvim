import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCneprZKzkDp_vh7UarQIw4Id-IJAMCZEk",
  authDomain: "bam-nvim.firebaseapp.com",
  projectId: "bam-nvim",
  storageBucket: "bam-nvim.appspot.com",
  messagingSenderId: "994867030843",
  appId: "1:994867030843:web:f9739ee4c9fc8d2855651e",
  measurementId: "G-HWNR0XNDBL"
};

const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp);
 