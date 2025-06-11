// src/components/SetCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';

export default function SetCard({ item }) {
  const { deleteSet, updateSet } = useUserSessions();
  const {
    setSelectedSet,
    setView,
    selectedSessionId,
  } = useNavigation();

  const goToSet = () => {
    setSelectedSet(item);
    setView('SetDetail');
  };

  const handleDelete = () => {
    Alert.alert('Delete Set', 'Are you sure you want to delete this set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSet(selectedSessionId, item.id);
            setView('');
            setTimeout(() => setView('SessionDetail'), 10);
          } catch (err) {
            Alert.alert('Error', 'Failed to delete set.');
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  const promptRename = () => {
    Alert.prompt('Rename Set', 'Enter new exercise name:', async (text) => {
      const newName = text.trim();
      if (!newName) return;
      try {
        await updateSet(selectedSessionId, item.id, { exercise: newName });
        setView('');
        setTimeout(() => setView('SessionDetail'), 10);
      } catch (err) {
        Alert.alert('Error', 'Failed to rename set.');
        console.error('Rename error:', err);
      }
    });
  };

  return (
    <View style={styles.setCard}>
      <TouchableOpacity onPress={goToSet} style={{ flex: 1 }}>
        <Text style={styles.exercise}>{item.exercise}</Text>
        <Text style={styles.info}>
          Reps: {item.reps} | Duration: {item.duration}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={promptRename}>
        <Text style={styles.btn}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.btn}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  back: { color: '#007AFF', marginBottom: 10 },
  setCard: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exercise: { fontWeight: 'bold' },
  info: { marginTop: 4 },
  btn: { fontSize: 16 },
});
