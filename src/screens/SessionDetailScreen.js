// src/screens/SessionDetailScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import SetCard from '../components/SetCard';
import BluetoothRecordingScreen from './BluetoothRecordingScreen';

export default function SessionDetailScreen() {
  const { selectedSessionId, view, setView } = useNavigation();
  const { sessions, fetchSets, addSet } = useUserSessions();

  const [sets, setSets] = useState([]);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  const loadSets = async () => {
    if (selectedSessionId) {
      const newSets = await fetchSets(selectedSessionId);
      setSets(newSets);
    }
  };

  useEffect(() => {
    loadSets();
  }, [selectedSessionId]);

  const handleAddSet = async () => {
    await addSet(selectedSessionId);
    await loadSets();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>{selectedSession?.name || ''}</Text>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SetCard item={item} />}
      />

      <TouchableOpacity onPress={handleAddSet}>
        <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>+ Add Set</Text>
      </TouchableOpacity>

      <BluetoothRecordingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  back: { color: '#007AFF', marginBottom: 10 },
});
