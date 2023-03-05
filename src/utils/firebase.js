import { auth, db } from '../config/firebase'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';

export const restrictedAccessCodes = [
  'devtest',
  'accounterror',
]

export const getUserRef = (accessCode) => doc(db, 'users', accessCode);
export const getUserDoc = (accessCode) => getDoc(getUserRef(accessCode));

export const postUserAnswers = (accessCode, answers) => (
  updateDoc(getUserRef(accessCode), {
    answers,
    score: answers.reduce((sum, curr) => sum += curr ? 1 : 0, 0),
    ...(accessCode !== 'devtest' && { status: 'completed' })
  })
    .catch(() => {throw Error('Error updating user')})
);

export const createUser = (accessCode) => (
  getUserDoc(accessCode)
    .catch(() => { throw Error('Error creating user') })
    .then(userSnap => {
      if (restrictedAccessCodes.includes(accessCode)) throw Error('Restricted access code');
      return userSnap;
    })
    .then(userSnap => {
      if (userSnap.exists()) throw Error('User already exists');
      return setDoc(getUserRef(accessCode), {
        status: 'incomplete',
      })
    })
);

export const deleteUser = (accessCode) => (
  deleteDoc(getUserRef(accessCode))
    .catch(() => {throw Error('Error deleting user')})
);

export const researcherSignIn = (email, password) => (
  setPersistence(auth, browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(auth, email, password))
    .then(userCredential => userCredential.user)
    .catch(reason => {
      switch (reason.code) {
        case 'auth/too-many-requests':
          throw Error('This account has been temporarily disabled due to many failed login attempts.')
        case 'auth/wrong-password':
          throw Error('Wrong password')
        case 'auth/user-not-found':
          throw Error('Cannot find user with this email')
        default:
          throw reason
          // throw Error('Error with sign in. Try again later.')
      }
    })
);