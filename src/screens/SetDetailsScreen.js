import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import RepCard from '../components/RepCard';
import { IconButton, Button } from 'react-native-paper';

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
      await updateSet(selectedSessionId, selectedSet.id, { totalRpe: rpeToSave });
      for (const rep of newReps) {
        await updateRep(selectedSessionId, selectedSet.id, rep.id, { rpe: rep.rpe });
      }
    } catch (err) {
      console.error('Failed to save RPE:', err);
      Alert.alert('Error', 'Failed to save RPE');
    }
  };

  const handleAddRep = async () => {
    await addRep(selectedSessionId, selectedSet.id);
    await loadReps();
  };

  const renderRepRow = ({ item, index }) => (
    <RepCard
      item={item}
      index={index}
      reloadReps={loadReps}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
          onPress={goBack}
          style={styles.backBtn}
        />
        <Text style={styles.header}>{selectedSet?.exercise || 'Set'}</Text>
      </View>

      <Text style={styles.summary}>Total Reps: {reps.length}</Text>

      <View style={styles.totalRpeRow}>
        <Text style={styles.rpeLabel}>Total RPE:</Text>
        <TextInput
          style={styles.totalRpeInput}
          keyboardType="numeric"
          value={totalRpe}
          onChangeText={handleTotalRpeChange}
          placeholder="1-10"
          placeholderTextColor="#777"
        />
      </View>

      <FlatList
        data={reps}
        keyExtractor={(item) => item.id}
        renderItem={renderRepRow}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Button mode="contained" onPress={handleAddRep} style={styles.addButton}>
        + Add Rep
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  summary: {
    color: '#aaa',
    marginBottom: 12,
  },
  totalRpeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rpeLabel: {
    fontWeight: '500',
    color: '#fff',
    marginRight: 8,
  },
  totalRpeInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 6,
    width: 60,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  addButton: {
    marginVertical: 16,
    backgroundColor: '#e74c3c',
  },
});
