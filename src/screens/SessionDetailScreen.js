import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import SeeDetails from '../components/SeeDetails';

const dummySets = [
  { id: '1', exercise: 'Bench Press', reps: 10, tempo: '2-1-2', duration: '30s' },
  { id: '2', exercise: 'Incline Press', reps: 8, tempo: '2-1-1', duration: '28s' },
];

export default function SessionDetailScreen({ session, onSetPress, onBack }) {
  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <Text>← Back</Text>
      </TouchableOpacity>
      <FlatList
        data={session.sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SeeDetails set={item} onPress={() => onSetPress(item)} />

        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
