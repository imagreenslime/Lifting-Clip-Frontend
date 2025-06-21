// src/screens/LiftsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useUserLifts } from '../hooks/useUserLifts';
import { useUserSessions } from '../hooks/useUserSessions';

export default function LiftsScreen() {
  const { lifts, addLift, deleteLift } = useUserLifts();
  const { sessions, fetchAllSetsAcrossSessions, fetchReps } = useUserSessions();

  const [newLiftName, setNewLiftName] = useState('');
  const [allSets, setAllSets] = useState([]);

  useEffect(() => {
    if (sessions.length > 0) {
      loadSets();
    }
  }, [sessions]);

  const loadSets = async () => {
    const sets = await fetchAllSetsAcrossSessions();
    const setsWithReps = [];
  
    for (const set of sets) {
      const reps = await fetchReps(set.sessionId, set.id); // wait for reps
      setsWithReps.push({
        ...set,
        reps, // now you have all repdata here
      });
    }
  
    setAllSets(setsWithReps);
  };
  

  const handleAddLift = async () => {
    if (!newLiftName.trim()) return;
    await addLift(newLiftName.trim().toLowerCase());
    setNewLiftName('');
  };

  const getAllSetsForLift = (liftType) => {
    return allSets.filter(set => 
      set.liftType?.toLowerCase() === liftType.toLowerCase()
    );
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
                Reps: {set.repsCount} | RPE: {set.totalRpe ?? ''}
              </Text>
                
              <Text>--------</Text>
              {set.reps && set.reps.length > 0 ? (
                set.reps.map((rep, idx) => (
                    <View key={idx} style={{ paddingLeft: 10 }}>
                    <Text>Rep {idx + 1}: RPE {rep.rpe}, ROM {rep.rom}, Tempo {rep.tempo}</Text>
                    </View>
                ))
                ) : (
                <Text style={{ paddingLeft: 10 }}>No reps</Text>
                )}
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

