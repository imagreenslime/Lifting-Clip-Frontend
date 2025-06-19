// src/hooks/useUserLifts.js

import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';

export function useUserLifts() {
  const { user } = useAuth();
  const [lifts, setLifts] = useState([]);

  const getLiftCollection = () => {
    return collection(db, 'users', user.uid, 'lifts');
  };

  const fetchLifts = async () => {
    if (!user?.uid) return;
    try {
      const ref = getLiftCollection();
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLifts(data);
    } catch (err) {
      console.error('Failed to fetch lifts:', err);
    }
  };

  const addLift = async (name) => {
    const ref = getLiftCollection();
    const newDoc = await addDoc(ref, { name });
    await fetchLifts();
    return newDoc.id;
  };

  const deleteLift = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'lifts', id));
      await fetchLifts();
    } catch (err) {
      console.error('Failed to delete lift:', err);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchLifts();
  }, [user]);

  return { lifts, addLift, deleteLift, fetchLifts };
}
