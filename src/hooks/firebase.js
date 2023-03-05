import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { restrictedAccessCodes, getUserDoc } from '../utils/firebase';

const userCollection = collection(db, 'users')

export function useGetUser(accessCode, fetchImmediately) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function refresh() {
    if (loading) return;

    if (!accessCode) return setError('Error fetching user info');

    setLoading(true);
    getUserDoc(accessCode)
      .then(userSnap => {
        setUser(userSnap.data() || null);
        setError(userSnap.exists() ? '' : `Unable to find user: ${accessCode}`);
      })
      .catch(() => setError('Error fetching user info'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (fetchImmediately) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [user, error, loading, refresh];
}

export function useUserCollection() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    function updateUsers(collectionSnap) {
      setUsers(collectionSnap.docs.reduce((newUsers, currDoc) => {
        if (restrictedAccessCodes.includes(currDoc.id)) return newUsers;

        newUsers[currDoc.id] = currDoc.data();
        return newUsers;
      }, {}));
    }

    const unsub = onSnapshot(userCollection, updateUsers);
    return unsub;
  }, [])

  return users;
}

export function useResearcherAuth() {
  const [researcher, setResearcher] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setResearcher);
  }, [])

  return researcher;
}