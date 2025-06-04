// src/components/SessionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SessionCard({ session, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{session.name}</Text>
      <Text style={styles.details}>{session.date} - {session.totalSets} Sets / {session.totalReps} Reps</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#eee', marginBottom: 12, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  details: { marginTop: 4, color: '#555' },
});