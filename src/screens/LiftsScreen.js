// src/screens/LiftsScreen.js

// src/screens/LiftsScreen.js

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useUserLifts } from '../hooks/useUserLifts';
import { useUserSessions } from '../hooks/useUserSessions';

export default function LiftsScreen() {
  const { lifts, addLift, deleteLift } = useUserLifts();
  const { sessions } = useUserSessions();

  const [newLiftName, setNewLiftName] = useState('');

  const handleAddLift = async () => {
    if (!newLiftName.trim()) return;
    await addLift(newLiftName.trim().toLowerCase());
    setNewLiftName('');
  };

  const getAllSetsForLift = (liftType) => {
    const sets = [];
    sessions.forEach(session => {
      (session.sets || []).forEach(set => {
        if (set.liftType?.toLowerCase() === liftType.toLowerCase()) {
          sets.push({
            sessionName: session.name,
            sessionDate: session.date,
            setId: set.id,
            exercise: set.exercise,
            repdata: set.repdata,
            totalRpe: set.totalRpe
          });
        }
      });
    });
    return sets;
  };

    
  const renderLift = ({ item }) => {
    const sets = getAllSetsForLift(item.name);
    return (
      <View style={styles.liftCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={styles.liftTitle}>{item.name.toUpperCase()}</Text>
          <TouchableOpacity onPress={() => deleteLift(item.id)}>
            <Text style={styles.btnDelete}>🗑</Text>
          </TouchableOpacity>
        </View>
        {sets.length === 0 ? (
          <Text style={styles.noData}>No sets recorded for this lift.</Text>
        ) : (
          sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <Text>Session: {set.sessionName}</Text>
              <Text>Exercise: {set.exercise}</Text>
              <Text>
                Reps: {Object.keys(set.repdata).length} | RPE:{set.totalRpe ?? ''}
              </Text>
              <Text>--------</Text>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lifts</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={newLiftName}
          onChangeText={setNewLiftName}
          placeholder="New Lift Name"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddLift}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lifts}
        keyExtractor={(item) => item.id}
        renderItem={renderLift}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  addRow: { flexDirection: 'row', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
  },
  liftCard: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  liftTitle: { fontWeight: 'bold', fontSize: 16 },
  btnDelete: { fontSize: 16 },
  noData: { color: '#888', fontStyle: 'italic' },
  setRow: { marginTop: 8 },
});

