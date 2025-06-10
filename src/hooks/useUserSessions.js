// src/hooks/useUserSessions.js

import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc, doc
} from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';

export function useUserSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getUid = () => {
    if (!user?.uid) throw new Error('User not authenticated');
    return user.uid;
  };

  const getRef = () => {
    const uid = getUid();
    return collection(db, 'users', uid, 'sessions');
  };

  const fetchSessions = async () => {
    try {
      const ref = getRef();
      setLoading(true);
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (session) => {
    const ref = getRef();
    const docRef = await addDoc(ref, session);
    const newSession = { id: docRef.id, ...session };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const deleteSession = async (id) => {
    const uid = getUid();
    try {
      await deleteDoc(doc(db, 'users', uid, 'sessions', id));
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  };

  const updateSession = async (id, updates) => {
    const uid = getUid();
    try {
      await updateDoc(doc(db, 'users', uid, 'sessions', id), updates);
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (err) {
      console.error('Failed to update session:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user?.uid) fetchSessions();
  }, [user]);

  return { sessions, loading, addSession, deleteSession, updateSession };
}
