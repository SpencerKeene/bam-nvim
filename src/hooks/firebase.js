import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../config/firebase";
import { getUserDoc, getUserResultsRef } from "../utils/firebase";

// Collections
const userCollection = collection(db, "users");

// Queries
const researcherOwnedUserQuery = () =>
  query(userCollection, where("researcher", "==", auth.currentUser.uid));

// Functions
const newUserObject = (userData) => ({
  ...userData,
  results: { score: "loading...", answers: "loading..." },
});

// Hooks
export function useGetUser(accessCode, fetchImmediately) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function refresh() {
    if (loading) return;

    if (!accessCode) return setError("Error fetching user info");

    setLoading(true);
    getUserDoc(accessCode)
      .then((userSnap) => {
        setUser(userSnap.data() || null);
        setError(userSnap.exists() ? "" : `Unable to find user: ${accessCode}`);
      })
      .catch(() => setError("Error fetching user info"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (fetchImmediately) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [user, error, loading, refresh];
}

export function useUserCollection() {
  const [users, setUsers] = useState([]);
  const unsubResultsRef = useRef({});

  useEffect(() => {
    function unsubResults() {
      Object.values(unsubResultsRef.current).forEach((unsub) => unsub());
      unsubResultsRef.current = {};
    }
    function subToUserResults(userId) {
      const snapshotHandler = (resultsSnap) => {
        setUsers((prevUsers) => {
          const prevUser = prevUsers[userId];
          const results = resultsSnap.data();
          const newUser = { ...prevUser, results };
          return { ...prevUsers, [userId]: newUser };
        });
      };

      const unsub = onSnapshot(
        getUserResultsRef(userId),
        snapshotHandler,
        () => onSnapshot(getUserResultsRef(userId), snapshotHandler) // if it fails, try again
      );
      return unsub;
    }
    function subToUsers() {
      const unsub = onSnapshot(researcherOwnedUserQuery(), (collectionSnap) => {
        unsubResults();
        const newUsers = collectionSnap.docs.reduce((acc, doc) => {
          const userId = doc.id;
          acc[userId] = newUserObject(doc.data());
          const unsub = subToUserResults(userId);
          unsubResultsRef.current[userId] = unsub;
          return acc;
        }, {});
        setUsers(newUsers);
      });
      return unsub;
    }

    const unsubUsers = subToUsers();

    function unsubAll() {
      unsubUsers();
      unsubResults();
    }
    return unsubAll;
  }, []);

  return users;
}

export function useResearcherAuth() {
  const [researcher, setResearcher] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setResearcher);
  }, []);

  return researcher;
}
