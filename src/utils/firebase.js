import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore';

export async function getUser(username) {
  const docRef = username && doc(db, 'users', username);
  const docSnap = await getDoc(docRef);
  const user = docSnap.data()
  return user;
}