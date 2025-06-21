// src/screens/LiftsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useUserLifts } from '../hooks/useUserLifts';
import { useUserSessions } from '../hooks/useUserSessions';
import { Button, IconButton, List } from 'react-native-paper';

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
      const reps = await fetchReps(set.sessionId, set.id);
      setsWithReps.push({
        ...set,
        reps,
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
    return allSets.filter(
      (set) => set.liftType?.toLowerCase() === liftType.toLowerCase()
    );
  };

  const renderLift = ({ item }) => {
    const sets = getAllSetsForLift(item.name);

    return (
      <List.Accordion
        title={item.name.toUpperCase()}
        titleStyle={styles.accordionTitle}
        style={styles.liftCard}
        theme={{ colors: { background: '#222222' } }}
        right={(props) => (
          <IconButton
            icon="trash-can"
            iconColor="#e74c3c"
            size={18}
            onPress={() => deleteLift(item.id)}
          />
        )}
      >
        {sets.length === 0 ? (
          <Text style={styles.noData}>No sets recorded for this lift.</Text>
        ) : (
          sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <Text style={styles.setText}>Session: {set.sessionName}</Text>
              <Text style={styles.setText}>Exercise: {set.exercise}</Text>
              <Text style={styles.setText}>
                Reps: {set.repsCount} | RPE: {set.totalRpe ?? ''}
              </Text>

              {set.reps && set.reps.length > 0 ? (
                set.reps.map((rep, idx) => (
                  <View key={idx} style={styles.repRow}>
                    <Text style={styles.repText}>
                      Rep {idx + 1}: RPE {rep.rpe}, ROM {rep.rom}, Tempo {rep.tempo}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.repText}>No reps</Text>
              )}
            </View>
          ))
        )}
      </List.Accordion>
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
          placeholderTextColor="#777"
        />
        <Button mode="contained" style={styles.addButton} onPress={handleAddLift}>
          Add
        </Button>
      </View>

      <FlatList
        data={lifts}
        keyExtractor={(item) => item.id}
        renderItem={renderLift}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 10,
    flex: 1,
    marginRight: 8,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  liftCard: {
    backgroundColor: '#222222',
    borderRadius: 6,
    marginBottom: 6,
  },
  accordionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  noData: {
    color: '#888',
    fontStyle: 'italic',
    padding: 6,
  },
  setRow: {
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  setText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 2,
  },
  repRow: {
    paddingLeft: 6,
    marginBottom: 1,
  },
  repText: {
    color: '#aaa',
    fontSize: 11,
  },
});
