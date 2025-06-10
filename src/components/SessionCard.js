// src/components/SessionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';

export default function SessionCard({ item }) {
  const { deleteSession, updateSession } = useUserSessions();
  const {
    setView,
    selectedSession,
    setSelectedSession,
  } = useNavigation();

  const goToSession = () => {
    setSelectedSession(item);
    setView('SessionDetail');
  };
  console.log("Session card items:", item);
  const handleDelete = () => {
    console.log('Deleting session with id:', item?.id);
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(item.id);
              if (selectedSession?.id === item.id) setView('Home');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete session.');
              console.error('Delete error:', err);
            }
          },
        },
      ]
    );
  };

  const promptRename = () => {
    Alert.prompt('Rename Session', 'Enter new name:', async (text) => {
      const newName = text.trim();
      if (!newName) return;
      try {
        await updateSession(item.id, { name: newName });
      } catch (err) {
        Alert.alert('Error', 'Failed to rename session.');
        console.error('Rename error:', err);
      }
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardLeft} onPress={goToSession}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.date}</Text>
      </TouchableOpacity>
      <View style={styles.cardRight}>
        <TouchableOpacity onPress={promptRename}>
          <Text style={styles.btn}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
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
