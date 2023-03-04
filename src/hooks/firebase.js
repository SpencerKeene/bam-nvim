import { useEffect, useState } from 'react';
import { getUserDoc } from '../utils/firebase';

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