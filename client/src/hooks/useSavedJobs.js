import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const buildStorageKey = (userId) => `marketing-sales-saved-jobs:${userId || 'guest'}`;

function useSavedJobs() {
  const { user } = useAuth();
  const storageKey = useMemo(() => buildStorageKey(user?._id), [user?._id]);
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (_error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSavedJobs(raw ? JSON.parse(raw) : []);
    } catch (_error) {
      setSavedJobs([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(savedJobs));
    window.dispatchEvent(new CustomEvent('saved-jobs:updated', { detail: savedJobs }));
  }, [savedJobs, storageKey]);

  const toggleSavedJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return {
    savedJobs,
    isSaved: (jobId) => savedJobs.includes(jobId),
    savedCount: savedJobs.length,
    toggleSavedJob
  };
}

export default useSavedJobs;
