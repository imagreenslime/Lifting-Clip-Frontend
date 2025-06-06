// src/components/SessionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SessionCard({ item, onSessionPress, promptRename, onDeleteSession}) {
  return (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardLeft} onPress={() => onSessionPress(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.date}</Text>
    </TouchableOpacity>
    <View style={styles.cardRight}>
      <TouchableOpacity onPress={() => promptRename(item.id)}>
        <Text style={styles.btn}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDeleteSession(item.id)}>
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
