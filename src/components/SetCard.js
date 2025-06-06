// src/components/SetCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SetCard({ item, onSetPress, promptRename, onDeleteSet}) {
  return (
<View style={styles.setCard}>
            <TouchableOpacity onPress={() => onSetPress(item)} style={{ flex: 1 }}>
              <Text style={styles.exercise}>{item.exercise}</Text>
              <Text style={styles.info}>
                Reps: {item.reps} | Duration: {item.duration}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => promptRename(item.id)}>
              <Text style={styles.btn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDeleteSet(item.id)}>
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
  
