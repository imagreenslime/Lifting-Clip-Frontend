import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SeeDetails({ set, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.setCard}>
      <Text style={styles.exercise}>{set.exercise}</Text>
      <Text style={styles.info}>
        Reps: {set.reps} | Tempo: {set.tempo} | Duration: {set.duration}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  setCard: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  exercise: { fontWeight: 'bold' },
  info: { marginTop: 4 },
});
