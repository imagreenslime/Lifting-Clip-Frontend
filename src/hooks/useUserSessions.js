// src/hooks/useUserSessions.js

import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
export function useUserSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const randomId = () =>
  Array.from({ length: 12 }, () => Math.floor(Math.random() * 36).toString(36)).join('');

  const getUid = () => {
    if (!user?.uid) throw new Error('User not authenticated');
    return user.uid;
  };

  const getSessionReference = () => {
    const uid = getUid();
    return collection(db, 'users', uid, 'sessions');
  };

  const fetchSessions = async () => {
    try {
      const ref = getSessionReference();
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
// changing sessions

  const addSessionOld = async (session) => {
    const ref = getSessionReference();
    const docRef = await addDoc(ref, session);
    const newSession = { id: docRef.id, ...session };
    setSessions(prev => [newSession, ...prev]);

    return newSession;
  };
  
  const addSession = async () => {
    const ref = getSessionReference();
  
    const defaultSet = {
      id: Date.now().toString(),
      exercise: 'Sample Bench Press',
      duration: '30s',
      repdata: {
        rep1: {
          id: 'rep1',
          duration: '12.5s',
          rom: '25.4 inches',
          tempo: '1.25s-5.5s-6.25s',
        },
        rep2: {
          id: 'rep2',
          duration: '12.5s',
          rom: '26 inches',
          tempo: '1.25s-5.5s-6.25s',
        },
      },
    };

    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      sets: [defaultSet],
      id: randomId(),
    };
    
    const docRef = await addDoc(ref, session);
    const newSession = { id: docRef.id, ...session };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const findSessionIdById = async (uid, fieldValue) => {
    const sessionsRef = collection(db, "users", uid, "sessions");
    const q = query(sessionsRef, where("id", "==", fieldValue));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching session found");
      return null;
    }
    const docSnap = snapshot.docs[0]; // assuming the field is unique
    return docSnap.id;
  };


  const deleteSession = async (id) => {
    const uid = getUid();
    try {
      const documentID = await findSessionIdById(uid, id);
      await deleteDoc(doc(db, 'users', uid, 'sessions', documentID));
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  };

  const updateSession = async (id, updates) => {
    const uid = await getUid();
    const documentID = await findSessionIdById(uid, id);
    try {
      await updateDoc(doc(db, 'users', uid, 'sessions', documentID), updates);
      setSessions(prev => {
        if (!Array.isArray(prev)) return [];
        prev.map(s => s.id === id ? { ...s, ...updates } : s);
      });
    } catch (err) {
      console.error('Failed to update session:', err);
      throw err;
    }
  };

// changing sets

  const addSet = async (sessionId) => {
    
  };

  const updateSet = async (sessionId, setId, updates) => {
    const uid = await getUid();
    const documentID = await findSessionIdById(uid, sessionId);
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;
      const updatedSets = session.sets.map(set =>
        set.id === setId ? { ...set, ...updates } : set
      );
      const sessionDocRef = doc(db, 'users', uid, 'sessions', documentID);
      await updateDoc(sessionDocRef, { sets: updatedSets });
      setSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, sets: updatedSets } : s
      ));
    } catch (error) {
      console.error("failed to rename set", error);
      throw error;
    }
  };

  const deleteSet = async (sessionId, setId) => {
    const uid = await getUid();
    const documentID = await findSessionIdById(uid, sessionId);
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;
      const updatedSets = session.sets.filter(set => set.id !== setId);
      const sessionDocRef = await doc(db, 'users', uid, 'sessions', documentID);
      await setDoc(sessionDocRef, {sets: updatedSets}, { merge: true });

      setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, sets: updatedSets } : s
    ));
    } catch (error) {
      console.error("failed to delete set:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.uid) fetchSessions();
  }, [user]);

  return { sessions, loading, addSession, deleteSession, updateSession, addSet, updateSet, deleteSet };
}
