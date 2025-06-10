// src/components/SessionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { useApp } from '../providers/NavigationContext';
export default function SessionCard({ item }) {
  const {
    view, setView,
    sessions, setSessions,
    selectedSession, setSelectedSession,
  } = useApp();

  const updateSessions = (newSessions) => setSessions([...newSessions]);

  const deleteSession = (id) => {
    updateSessions(sessions.filter(session => session.id !== id));
    if (selectedSession?.id === id) setView('Home');
  };

  const renameSession = (id, newName) => {
    updateSessions(sessions.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const goToSession = (session) => {
    setSelectedSession(session);
    setView('SessionDetail');
  };

  const promptRename = (id) => {
    Alert.prompt('Rename Session', 'Enter new name:', (text) => {
      if (text.trim()) renameSession(id, text);
    })};

  return (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardLeft} onPress={() => goToSession(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.date}</Text>
    </TouchableOpacity>
    <View style={styles.cardRight}>
      <TouchableOpacity onPress={() => promptRename(item.id)}>
        <Text style={styles.btn}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteSession(item.id)}>
        <Text style={styles.btn}>🗑</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
  },
  cardLeft: { flex: 1 },
  cardRight: {
    flexDirection: 'row',
    gap: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  details: { color: '#555', marginTop: 4 },
  btn: { fontSize: 18, marginLeft: 10 },
});
