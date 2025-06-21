// src/hooks/useUserSessions.js

import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { 
  collection, doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, where 
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

  const getSessionRef = () => {
    const uid = getUid();
    return collection(db, 'users', uid, 'sessions');
  };

  // fetching

  const fetchSessions = async () => {
    try {
      const ref = getSessionRef();
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
  const fetchAllSetsAcrossSessions = async () => {
    const uid = getUid();
    const allSets = [];
  
    for (const session of sessions) {
      const setsSnapshot = await getDocs(collection(db, 'users', uid, 'sessions', session.id, 'sets'));
      const sets = setsSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          sessionId: session.id,
          sessionName: session.name,
          sessionDate: session.date,
          ...doc.data(),
          repsCount: 0, // optional, if you want you can also fetch repdata.length
        };
      });
      allSets.push(...sets);
    }
  
    return allSets;
  };
  
  const addSession = async () => {
    const ref = getSessionRef();
    const session = {
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(ref, session);
    const newSession = { id: docRef.id, ...session };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const updateSession = async (sessionId, updates) => {
    const uid = getUid();
    const sessionDoc = doc(db, 'users', uid, 'sessions', sessionId);
    await updateDoc(sessionDoc, updates);
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, ...updates } : s)
    );
  };

  const deleteSession = async (sessionId) => {
    const uid = getUid();
    await deleteDoc(doc(db, 'users', uid, 'sessions', sessionId));
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // --- SETS (subcollection) ---

  const fetchSets = async (sessionId) => {
    const uid = getUid();
    const ref = collection(db, 'users', uid, 'sessions', sessionId, 'sets');
    const snapshot = await getDocs(ref);
    const sets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    sets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return sets;
  };

  const addSet = async (sessionId) => {
    const uid = getUid();
    const setData = {
      exercise: 'Untitled Set',
      liftType: '',
      duration: '0s',
      totalRpe: '',
      createdAt: new Date().toISOString(),
    };
    const setsRef = collection(db, 'users', uid, 'sessions', sessionId, 'sets');
    const docRef = await addDoc(setsRef, setData);
    return { id: docRef.id, ...setData };
  };

  const updateSet = async (sessionId, setId, updates) => {
    const uid = getUid();
    const setDocRef = doc(db, 'users', uid, 'sessions', sessionId, 'sets', setId);
    await updateDoc(setDocRef, updates);
  };

  const deleteSet = async (sessionId, setId) => {
    const uid = getUid();
    const setDocRef = doc(db, 'users', uid, 'sessions', sessionId, 'sets', setId);
    await deleteDoc(setDocRef);
  };

  // --- REPS (subcollection) ---

  const fetchReps = async (sessionId, setId) => {
    const uid = getUid();
    const ref = collection(db, 'users', uid, 'sessions', sessionId, 'sets', setId, 'repdata');
    const snapshot = await getDocs(ref);
    const reps = snapshot.docs.map(doc => doc.data());
    reps.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      return numA - numB;
    });
    console.log(reps);
    return reps;
  };

  const addRep = async (sessionId, setId) => {
    const uid = getUid();
    const repId = `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newRep = {
      id: repId,
      duration: '0.00s',
      rom: '0',
      tempo: '',
      rpe: '',
    };
    const repsRef = collection(db, 'users', uid, 'sessions', sessionId, 'sets', setId, 'repdata');
    await setDoc(doc(repsRef, repId), newRep);
  };

  const updateRep = async (sessionId, setId, repId, updates) => {
    const uid = getUid();
    const repDocRef = doc(db, 'users', uid, 'sessions', sessionId, 'sets', setId, 'repdata', repId);
    await updateDoc(repDocRef, updates);
  };

  const deleteRep = async (sessionId, setId, repId) => {
    const uid = getUid();
    const repDocRef = doc(db, 'users', uid, 'sessions', sessionId, 'sets', setId, 'repdata', repId);
    await deleteDoc(repDocRef);
  };

  useEffect(() => {
    if (user?.uid) fetchSessions();
  }, [user]);

  return {
    sessions, loading, fetchSessions, fetchAllSetsAcrossSessions,
    addSession, updateSession, deleteSession,
    fetchSets, addSet, updateSet, deleteSet,
    fetchReps, addRep, updateRep, deleteRep
  };
}
