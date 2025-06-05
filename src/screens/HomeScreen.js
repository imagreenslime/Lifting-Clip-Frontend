import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SessionCard from '../components/SessionCard';



export default function HomeScreen({ sessions, onSessionPress }) {
  return (
    <FlatList
      data={sessions}
      renderItem={({ item }) => (
        <SessionCard session={item} onPress={() => onSessionPress(item)} />
      )}
    />
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
