// src/screens/HomeScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SessionCard from '../components/SessionCard';

const dummySessions = [
  { id: '1', name: 'Push Day', date: '2025-06-01', totalSets: 4, totalReps: 35 },
  { id: '2', name: 'Legs 🔥', date: '2025-05-31', totalSets: 5, totalReps: 40 },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummySessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard session={item} onPress={() => navigation.navigate('SessionDetail', { session: item })} />
        )}
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: '#4CAF50', borderRadius: 30, padding: 16, elevation: 5,
  },
  fabText: { color: 'white', fontSize: 24 },
});