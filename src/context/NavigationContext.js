// src/providers/NavigationContext.js
import React, { createContext, useContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [tab, setTab] = useState('Home'); // Home or Bluetooth
  const [view, setView] = useState('Home'); // Home, SessionDetail, SetDetail
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [sessions, setSessions] = useState ([
    {
      id: '1',
      name: 'Push Day',
      date: '2025-06-01',
      sets: [
        { id: '1', exercise: 'Bench Press', reps: 10, tempo: '2-1-2', duration: '30s' },
        { id: '2', exercise: 'Incline Press', reps: 8, tempo: '2-1-1', duration: '28s' },
      ]
    },
    {
      id: '2',
      name: 'Legs 🔥',
      date: '2025-05-31',
      sets: [
        { id: '3', exercise: 'Squat', reps: 12, tempo: '3-1-3', duration: '40s' },
        { id: '4', exercise: 'Leg Press', reps: 10, tempo: '2-1-2', duration: '35s' },
      ]
    },
  ])
  return (
    <NavigationContext.Provider
      value={{
        sessions, setSessions,
        selectedSession, setSelectedSession,
        selectedSet, setSelectedSet,
        connectedDevice, setConnectedDevice,
        tab, setTab,
        view, setView
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
