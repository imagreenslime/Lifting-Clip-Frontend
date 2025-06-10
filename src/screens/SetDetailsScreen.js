// src/screens/SetDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
export default function SetDetailScreen({}) {
  const {
    selectedSet, view, setView
  } = useNavigation()

  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{selectedSet.exercise}</Text>
      <Text style={styles.summary}>
        Total Reps: {selectedSet.reps}
      </Text>

      <FlatList
        data={selectedSet.repData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.repCard}>
            <Text style={styles.repHeader}>Rep {index + 1}</Text>
            <Text>Duration: {item.duration}</Text>
            <Text>ROM: {item.rom}</Text>
            <Text>Tempo: {item.tempo}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No rep data available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  back: { color: '#007AFF', marginBottom: 10 },
  summary: { marginBottom: 16 },
  repCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  repHeader: { fontWeight: 'bold', marginBottom: 4 },
});
