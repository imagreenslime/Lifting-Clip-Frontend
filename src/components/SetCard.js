// src/components/SetCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../providers/NavigationContext';
export default function SetCard({ item }) {
  const {
    setSelectedSet, setView, setSelectedSession, setSessions, selectedSession
  } = useApp()

  const goToSet = (set) => {
    setSelectedSet(set);
    setView('SetDetail');
  };

  const deleteSet = (sessionId, setId) => {
    setSessions(prevSessions => {
      const updated = prevSessions.map(s =>
        s.id === sessionId
          ? { ...s, sets: s.sets.filter(set => set.id !== setId) }
          : s
      );
      const updatedSession = updated.find(s => s.id === sessionId);
      setSelectedSession(updatedSession);
      return updated;
      })
    };
  
    const renameSet = (sessionId, setId, newName) => {
      setSessions(prevSessions => {
          const updated = prevSessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  sets: s.sets.map(set =>
                    set.id === setId ? { ...set, exercise: newName } : set
                  ),
                }
              : s
          );
          const updatedSession = updated.find(s => s.id === sessionId);
          setSelectedSession(updatedSession);
          return updated;
        });
    };

    const promptRename = (setId) => {
      Alert.prompt('Rename Set', 'Enter new exercise name:', (text) => {
        if (text.trim()) renameSet(selectedSession.id, setId, text);
      });
    };


  return (
<View style={styles.setCard}>
            <TouchableOpacity onPress={() => goToSet(item)} style={{ flex: 1 }}>
              <Text style={styles.exercise}>{item.exercise}</Text>
              <Text style={styles.info}>
                Reps: {item.reps} | Duration: {item.duration}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => promptRename(item.id)}>
              <Text style={styles.btn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSet(selectedSession.id, item.id)}>
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
  
