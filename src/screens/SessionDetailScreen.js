// src/screens/SessionDetailScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BluetoothRecordingScreen from './BluetoothRecordingScreen';
import SetCard from '../components/SetCard';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';

export default function SessionDetailScreen() {
  const { selectedSessionId, setView, view, } = useNavigation();
  const { sessions } = useUserSessions();
  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };
  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  if (!selectedSession) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}></Text>
      </View>
    );
  }

  const setsArray = Array.isArray(selectedSession.sets)
    ? selectedSession.sets
    : Object.values(selectedSession.sets || {});

  return (
    <View style={styles.container}>
      {console.log(selectedSessionId)}
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{selectedSession.name}</Text>
      <FlatList
        data={setsArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SetCard item={item} />}
      />
      <BluetoothRecordingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  back: { color: '#007AFF', marginBottom: 10 },
});
