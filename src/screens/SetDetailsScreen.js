import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SetDetailScreen({ set, onBack }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{set.exercise}</Text>
      <Text>Reps: {set.reps}</Text>
      <Text>Tempo: {set.tempo}</Text>
      <Text>Duration: {set.duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  back: { color: '#007AFF', marginBottom: 10 },
});
