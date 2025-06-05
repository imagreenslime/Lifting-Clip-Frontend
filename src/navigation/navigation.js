import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import SetDetailScreen from '../screens/SetDetailsScreen';
import BluetoothScreen from '../screens/BluetoothScreen';


const sessions = [
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
];

export default function App() {
  const [tab, setTab] = useState('Home'); // Home or Bluetooth
  const [view, setView] = useState('Home'); // Home, SessionDetail, SetDetail
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);

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
    if (tab === 'Bluetooth') return <BluetoothScreen />;
    if (tab === "Recording") return <View></View>;
    
    if (view === 'Home') return <HomeScreen sessions={sessions} onSessionPress={goToSession} />;
    if (view === 'SessionDetail') return <SessionDetailScreen session={selectedSession} onSetPress={goToSet} onBack={goBack} />;
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
