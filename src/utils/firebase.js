import { db } from '../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const getUserRef = (accessCode) => doc(db, 'users', accessCode);
export const getUserDoc = (accessCode) => getDoc(getUserRef(accessCode));

export const postUserAnswers = (accessCode, answers) => (
  updateDoc(getUserRef(accessCode), {
    answers,
    status: 'completed'
  })
);
