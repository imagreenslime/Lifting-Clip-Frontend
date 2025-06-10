//  src/hooks/useUserSessions.js

import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc, doc
} from 'firebase/firestore';

export function useUserSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid;

  const ref = uid ? collection(db, 'users', uid, 'sessions') : null;

  const fetchSessions = async () => {
    if (!ref) return;
    setLoading(true);
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSessions(data);
    setLoading(false);
  };

  const addSession = async (session) => {
    const docRef = await addDoc(ref, session);
    setSessions(prev => [{ id: docRef.id, ...session }, ...prev]);
  };

  const deleteSession = async (id) => {
    await deleteDoc(doc(db, 'users', uid, 'sessions', id));
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const updateSession = async (id, updates) => {
    await updateDoc(doc(db, 'users', uid, 'sessions', id), updates);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  useEffect(() => {
    if (uid) fetchSessions();
  }, [uid]);

  return { sessions, loading, addSession, deleteSession, updateSession };
}
