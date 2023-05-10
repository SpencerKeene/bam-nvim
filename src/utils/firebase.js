import { auth, db } from "../config/firebase";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";

// Document references
export const getUserRef = (accessCode) => doc(db, "users", accessCode);
export const getUserDoc = (accessCode) => getDoc(getUserRef(accessCode));

export const getUserResultsRef = (accessCode) =>
  doc(db, "users", accessCode, "private", "results");

// Document templates
const newUserDoc = () => ({
  status: "incomplete",
  researcher: auth.currentUser.uid,
});

const newResultsDoc = () => ({
  score: null,
  answers: null,
});

// Functions
export const postUserAnswers = (accessCode, answers) =>
  setDoc(getUserResultsRef(accessCode), {
    answers,
    score: answers.reduce((sum, curr) => sum + (curr ? 1 : 0), 0),
  })
    .then(() => updateDoc(getUserRef(accessCode), { status: "completed" }))
    .catch((err) => {
      throw Error("Error updating user. Error code: " + err.code);
    });

const setUserResults = (accessCode) =>
  setDoc(getUserResultsRef(accessCode), newResultsDoc());
const setUser = (accessCode) => setDoc(getUserRef(accessCode), newUserDoc());

export const createUser = (accessCode) =>
  setUserResults(accessCode)
    .then(() => setUser(accessCode))
    .catch(() => {
      throw Error("User already exists");
    });

export const deleteUser = (accessCode) =>
  Promise.all([
    deleteDoc(getUserResultsRef(accessCode)),
    deleteDoc(getUserRef(accessCode)),
  ]).catch(() => {
    throw Error("Error deleting user");
  });

export const researcherSignIn = (email, password) =>
  setPersistence(auth, browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(auth, email, password))
    .then((userCredential) => userCredential.user)
    .catch((reason) => {
      switch (reason.code) {
        case "auth/invalid-email":
          throw Error("Invalid email");
        case "auth/too-many-requests":
          throw Error(
            "This account has been temporarily disabled due to many failed login attempts."
          );
        case "auth/wrong-password":
          throw Error("Wrong password");
        case "auth/user-not-found":
          throw Error("Cannot find user with this email");
        default:
          // throw reason
          throw Error(
            "Error with sign in. Try again later. Error code: " + reason.code
          );
      }
    });

export const sendPasswordResetEmail = (email) =>
  firebaseSendPasswordResetEmail(auth, email).catch((reason) => {
    switch (reason.code) {
      case "auth/invalid-email":
        throw Error("Invalid email");
      case "auth/user-not-found":
        throw Error("Cannot find user with this email");
      default:
        throw Error(
          "Error sending password reset email. Try again later. Error code: " +
            reason.code
        );
    }
  });

const setStatus = (accessCode, status) =>
  updateDoc(getUserRef(accessCode), { status }).catch(() => {
    throw Error("Error updating user");
  });

export const setStatusPracticed = (accessCode) =>
  setStatus(accessCode, "practiced");

export const setStatusStarted = (accessCode) =>
  setStatus(accessCode, "started");
