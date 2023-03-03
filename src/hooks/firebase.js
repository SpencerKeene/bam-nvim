import { useState } from 'react';
import { db } from '../config/firebase'
import { collection, getDocs, query, updateDoc, where, limit } from 'firebase/firestore';

const usersCollectionRef = collection(db, 'users');

function fetchByUsername(username) {
  return getDocs(query(usersCollectionRef, where('username', '==', username), limit(1)))
    .then(userSnap => userSnap.docs[0])
}

function useUser(username, data, callback = () => {}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function refresh() {
    if (loading) return;

    setLoading(true);
    fetchByUsername(username)
      .then(userSnap => {
        setUser(userSnap?.data() || null)
        setError(userSnap ? '' : `Unable to find user: ${username}`);
      })
      .catch(() => setError('Error fetching user info'))
      .finally(() => setLoading(false));
  }

  function update() {
    if (loading) return;
  
    setLoading(true);
    fetchByUsername(username)
      .then(userSnap => updateDoc(userSnap.ref, data)
        .then(() => fetchByUsername(username)
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

  return {user, error, loading, refresh, update};
}

export function useGetUser(username) {
  // eslint-disable-next-line no-unused-vars
  const [user, error, loading, refresh, update] = useUser(username);
  return [user, error, loading, refresh];
}

export function useUpdateUser(username, data, callback) {
  // eslint-disable-next-line no-unused-vars
  const [user, error, loading, refresh, update] = useUser(username, data, callback);
  return [user, error, loading, update];
}