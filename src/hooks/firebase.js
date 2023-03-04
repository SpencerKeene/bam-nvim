import { useEffect, useState } from 'react';
import { db } from '../config/firebase'
import { collection, getDocs, query, updateDoc, where, limit } from 'firebase/firestore';

const usersCollectionRef = collection(db, 'users');

function fetchByAccessCode(accessCode) {
  return getDocs(query(usersCollectionRef, where('accessCode', '==', accessCode), limit(1)))
    .then(userSnap => userSnap.docs[0])
}

function useUser(accessCode, fetchImmediately, data, callback = () => {}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function refresh() {
    if (loading) return;

    if (!accessCode) return setError('Error fetching user info');

    setLoading(true);
    fetchByAccessCode(accessCode)
      .then(userSnap => {
        setUser(userSnap?.data() || null)
        setError(userSnap ? '' : `Unable to find user: ${accessCode}`);
      })
      .catch(() => setError('Error fetching user info'))
      .finally(() => setLoading(false));
  }

  function update() {
    if (loading) return;
  
    setLoading(true);
    fetchByAccessCode(accessCode)
      .then(userSnap => updateDoc(userSnap.ref, data)
        .then(() => fetchByAccessCode(accessCode)
          .then(updatedUserSnap => {
            setUser(updatedUserSnap.data());
            setError('');
            callback(true);
          })
        )
      )
      .catch(() => {
        setError('Error updating user info');
        callback(false);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (fetchImmediately) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [user, error, loading, refresh, update];
}

export function useGetUser(accessCode, fetchImmediately = false) {
  // eslint-disable-next-line no-unused-vars
  const [user, error, loading, refresh, update] = useUser(accessCode, fetchImmediately);
  return [user, error, loading, refresh];
}

export function useUpdateUser(accessCode, data, callback) {
  // eslint-disable-next-line no-unused-vars
  const [user, error, loading, refresh, update] = useUser(accessCode, false, data, callback);
  return [user, error, loading, update];
}