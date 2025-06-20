// src/screens/SetDetailScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import RepCard from '../components/RepCard';
export default function SetDetailScreen() {
  const { selectedSet, view, setView, selectedSessionId } = useNavigation();
  const { updateSet, addRep, sessions} = useUserSessions();

  const [totalRpe, setTotalRpe] = useState('');
  const [repRpeData, setRepRpeData] = useState({});

  const selectedSession = Array.isArray(sessions)
  ? sessions.find(s => s.id === selectedSessionId)
  : null;

  const currentSet = selectedSession?.sets?.find(set => set.id === selectedSet.id);


  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  const repDataArray = currentSet?.repdata
  ? Object.values(currentSet.repdata).sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = parseInt(b.id.replace(/\D/g, ''), 10);
      return numA - numB;
    })
  : [];

  useEffect(() => {
    // Load existing RPEs
    const initial = {};
    repDataArray.forEach((rep) => {
      initial[rep.id] = rep.rpe || '';
    });
    setRepRpeData(initial);
    setTotalRpe(selectedSet?.totalRpe?.toString() || '');
  }, [selectedSet]);

  const handleTotalRpeChange = (value) => {
    setTotalRpe(value);
    const rpeNum = parseInt(value, 10);
    if (isNaN(rpeNum)) return;

    const totalReps = repDataArray.length;

    const newRepData = {};
    repDataArray.forEach((rep, index) => {
      const repRpe = rpeNum - (totalReps - index - 1);
      newRepData[rep.id] = repRpe;
    });

    setRepRpeData(newRepData);
    saveRepRpe(newRepData, rpeNum);
  };

  const saveRepRpe = async (newRepData, rpeToSave) => {
    const updatedRepdata = { ...selectedSet.repdata };

    Object.keys(updatedRepdata).forEach(repId => {
      updatedRepdata[repId].rpe = newRepData[repId];
    });

    try {
      await updateSet(selectedSessionId, selectedSet.id, { repdata: updatedRepdata, totalRpe: rpeToSave });
    } catch (err) {
      console.error('Failed to save rep RPE:', err);
      Alert.alert('Error', 'Failed to save RPE');
    }
  };

  const renderRepRow = ({ item, index }) => { 
    return <RepCard item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedSet?.exercise}</Text>
      <Text style={styles.summary}>Total Reps: {repDataArray.length}</Text>

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
        data={repDataArray}
        keyExtractor={(item) => item.id}
        renderItem={renderRepRow}
        ListEmptyComponent={<Text>No rep data available.</Text>}
      />
      <TouchableOpacity onPress={() => addRep(selectedSessionId, selectedSet.id)}>
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
  repCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  repHeader: { fontWeight: 'bold', marginBottom: 4 },
  rpeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  repInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 4,
    width: 50,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
});
