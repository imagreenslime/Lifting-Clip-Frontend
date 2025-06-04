// src/screens/SessionDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SetDetails from '../components/SetDetails';

const dummySets = [
  { id: '1', exercise: 'Bench Press', reps: 10, tempo: '2-1-2', duration: '30s' },
  { id: '2', exercise: 'Incline Press', reps: 8, tempo: '2-1-1', duration: '28s' },
];

export default function SessionDetailScreen({ route }) {
  const { session } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{session.name}</Text>
      <FlatList
        data={dummySets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SetDetails set={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});