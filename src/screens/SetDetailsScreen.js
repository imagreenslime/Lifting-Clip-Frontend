// src/screens/SetDetailScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import RepCard from '../components/RepCard';

export default function SetDetailScreen() {
  const { selectedSet, selectedSessionId, view, setView } = useNavigation();
  const { fetchReps, addRep, updateSet, updateRep } = useUserSessions();

  const [reps, setReps] = useState([]);
  const [totalRpe, setTotalRpe] = useState('');

  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  const loadReps = async () => {
    if (selectedSessionId && selectedSet?.id) {
      const newReps = await fetchReps(selectedSessionId, selectedSet.id);
      setReps(newReps);
    }
  };

  useEffect(() => {
    loadReps();
    setTotalRpe(selectedSet?.totalRpe?.toString() || '');
  }, [selectedSessionId, selectedSet]);

  const handleTotalRpeChange = (value) => {
    setTotalRpe(value);
    const rpeNum = parseInt(value, 10);
    if (isNaN(rpeNum)) return;

    const totalReps = reps.length;
    const newReps = reps.map((rep, index) => ({
      ...rep,
      rpe: rpeNum - (totalReps - index - 1),
    }));

    setReps(newReps);
    saveRepRpe(newReps, rpeNum);
  };

  const saveRepRpe = async (newReps, rpeToSave) => {
    try {
      console.log(newReps);
      await updateSet(selectedSessionId, selectedSet.id, { totalRpe: rpeToSave });

      for (const rep of newReps) {
        await updateRep(selectedSessionId, selectedSet.id, rep.id, { rpe: rep.rpe });
      }

      console.log('Updated total Rpe');
    } catch (err) {
      console.error('Failed to save RPE:', err);
      Alert.alert('Error', 'Failed to save RPE');
    }
  };

  const handleAddRep = async () => {
    await addRep(selectedSessionId, selectedSet.id);
    await loadReps();
  };

  const handleReloadReps = async () => {
    await loadReps();
  };

  const renderRepRow = ({ item, index }) => (
    <RepCard
      item={item}
      index={index}
      reloadReps={handleReloadReps}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedSet?.exercise}</Text>
      <Text style={styles.summary}>Total Reps: {reps.length}</Text>

      <View style={styles.totalRpeRow}>
        <Text style={styles.rpeLabel}>Total RPE:</Text>
        <TextInput
          style={styles.totalRpeInput}
          keyboardType="numeric"
          value={totalRpe}
          onChangeText={handleTotalRpeChange}
          placeholder="1-10"
        />
      </View>

      <FlatList
        data={reps}
        keyExtractor={(item) => item.id}
        renderItem={renderRepRow}
      />

      <TouchableOpacity onPress={handleAddRep}>
        <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>+ Add Rep</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  back: { color: '#007AFF', marginBottom: 10 },
  summary: { marginBottom: 16 },
  totalRpeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rpeLabel: { fontWeight: '500', marginRight: 8 },
  totalRpeInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 4,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
});
