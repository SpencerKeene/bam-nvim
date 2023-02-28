import { db } from '../config/firebase'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

const usersCollectionRef = collection(db, 'users');

export async function getUser(username) {
  if (!username) return null;

  const userQuery = query(usersCollectionRef, where('username', '==', username))
  const userSnap = await getDocs(userQuery);
  const user = userSnap.docs[0].data()
  return user;
}

export async function postAnswers(username, answers) {
  
}