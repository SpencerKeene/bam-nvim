import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../config/firebase";
import { getUserDoc, getUserResultsRef } from "../utils/firebase";

// Collections
const userCollection = collection(db, "users");

// Queries
const researcherOwnedUserQuery = () =>
  query(userCollection, where("researcher", "==", auth.currentUser.uid));

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
  const [users, setUsers] = useState(null);
  const unsubResultsListRef = useRef([]);

  useEffect(() => {
    function subToUserResults(userId) {
      const unsub = onSnapshot(getUserResultsRef(userId), (resultsSnap) => {
        setUsers((prevUsers) => {
          const prevUser = prevUsers[userId];
          const results = resultsSnap.data();
          const newUser = { ...prevUser, results };
          return { ...prevUsers, [userId]: newUser };
        });
      });
      return unsub;
    }
    function subToUsers() {
      const unsub = onSnapshot(researcherOwnedUserQuery(), (collectionSnap) => {
        const newUsers = collectionSnap.docs.reduce((acc, doc) => {
          const userId = doc.id;
          const user = doc.data();
          acc[userId] = { ...user, results: null };
          const unsubResults = subToUserResults(userId);
          unsubResultsListRef.current.push(unsubResults);
          return acc;
        }, {});
        setUsers(newUsers);
      });
      return unsub;
    }

    const unsubUsers = subToUsers();

    function unsubFromAll() {
      unsubUsers();
      unsubResultsListRef.current.forEach((unsub) => unsub());
    }

    return unsubFromAll;
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
