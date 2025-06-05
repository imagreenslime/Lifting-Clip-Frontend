// src/navigation/navigation.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import SetDetailScreen from '../screens/SetDetailsScreen';
import BluetoothConnectScreen from '../screens/BluetoothConnectScreen';
import BluetoothRecordingScreen from '../screens/BluetoothRecordingScreen';

export default function App() {
  const [sessions, setSessions] = useState([
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

  const [tab, setTab] = useState('Home'); // Home or Bluetooth
  const [view, setView] = useState('Home'); // Home, SessionDetail, SetDetail
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const updateSessions = (newSessions) => setSessions([...newSessions]);

  const deleteSession = (id) => {
    updateSessions(sessions.filter(session => session.id !== id));
    if (selectedSession?.id === id) setView('Home');
  };

  const renameSession = (id, newName) => {
    updateSessions(sessions.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const deleteSet = (sessionId, setId) => {
  setSessions(prevSessions => {
    const updated = prevSessions.map(s =>
      s.id === sessionId
        ? { ...s, sets: s.sets.filter(set => set.id !== setId) }
        : s
    );
    const updatedSession = updated.find(s => s.id === sessionId);
    setSelectedSession(updatedSession);
    return updated;
    })
  };

  const renameSet = (sessionId, setId, newName) => {
    setSessions(prevSessions => {
        const updated = prevSessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                sets: s.sets.map(set =>
                  set.id === setId ? { ...set, exercise: newName } : set
                ),
              }
            : s
        );
        const updatedSession = updated.find(s => s.id === sessionId);
        setSelectedSession(updatedSession);
        return updated;
      });
  };

  const goToSession = (session) => {
    setSelectedSession(session);
    setView('SessionDetail');
  };

  const goToSet = (set) => {
    setSelectedSet(set);
    setView('SetDetail');
  };

  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  const renderScreen = () => {
    if (tab === 'Bluetooth') {
        return (
            <BluetoothConnectScreen onConnect={(device) => {
            setConnectedDevice(device);
            setView('BluetoothRecording');
            }} 
            connectedDevice={connectedDevice}
            onDisconnect={() => setConnectedDevice(null)}
            />
        );
          
    }
    if (tab === "Recording"){
        return (
            <BluetoothRecordingScreen
              device={connectedDevice}
              onDisconnect={() => setConnectedDevice(null)}
            />
          ); 
    }

    if (view === 'Home') return <HomeScreen sessions={sessions} onSessionPress={goToSession} onDeleteSession={deleteSession} onRenameSession={renameSession}/>;
    if (view === 'SessionDetail') return <SessionDetailScreen session={selectedSession} onSetPress={goToSet} onBack={goBack} onDeleteSet={(setId) => deleteSet(selectedSession.id, setId)} onRenameSet={(setId, name) => renameSet(selectedSession.id, setId, name)}/>;
    if (view === 'SetDetail') return <SetDetailScreen set={selectedSet} onBack={goBack} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => { setTab('Home'); setView('Home'); }} style={styles.tab}>
          <Text style={styles.tabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTab('Bluetooth'); setView('Bluetooth'); }} style={styles.tab}>
          <Text style={styles.tabText}>Bluetooth</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTab('Recording'); setView('Recording'); }} style={styles.tab}>
          <Text style={styles.tabText}>Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
  },
});
