// src/screens/SessionDetailScreen.js
import React, { useEffect,useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BluetoothRecordingScreen from './BluetoothRecordingScreen';
import SetCard from '../components/SetCard';
import { useApp } from '../providers/NavigationContext';
export default function SessionDetailScreen({ onAddSet}) {

  const {
    setSessions, 
    selectedSession, setSelectedSession,
    setView, view, 
    connectedDevice
  } = useApp()
  
  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{selectedSession.name}</Text>
      <FlatList
        data={selectedSession.sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SetCard item={item} />
        )}
      />
      <BluetoothRecordingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  back: { color: '#007AFF', marginBottom: 10 },
  setCard: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exercise: { fontWeight: 'bold' },
  info: { marginTop: 4 },
  btn: { fontSize: 16 },
});
