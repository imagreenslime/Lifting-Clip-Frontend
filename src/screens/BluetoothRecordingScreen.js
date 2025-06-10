// src/screens/BluetoothRecordScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BluetoothService from '../services/BluetoothService';
import { useNavigation } from '../context/NavigationContext';
export default function BluetoothRecordingScreen({ }) {
  const {
    connectedDevice, selectedSession, setSessions, setSelectedSession
  } = useNavigation();

  const [processedReps, setProcessedReps] = useState(new Set());
  const onDisconnect = () => {
    
  };

  const addSetToSession = (sessionId, newSet) => {
    setSessions(prevSessions => {
      const updated = prevSessions.map(s =>
        s.id === sessionId
          ? { ...s, sets: [...s.sets, newSet] }
          : s
      );
      const updatedSession = updated.find(s => s.id === sessionId);
      setSelectedSession(updatedSession);
      return updated;
    });
  };

  BluetoothService.onSetUpdate((summaries) => {
    const latestSetId = summaries[summaries.length - 1].set;
  
    const repsInSet = summaries.filter(s => 
      s.set === latestSetId && !processedReps.has(s.id)
    );
  
    if (repsInSet.length === 0) return;
  
    const convertedSet = {
      id: Date.now().toString(),
      exercise: '(Enter Exercise)',
      reps: repsInSet.length,
      duration: `${repsInSet.reduce((sum, r) => sum + r.dur, 0).toFixed(2)}s`,
      repData: repsInSet.map(rep => ({
        id: rep.id.toString(),
        duration: `${rep.dur.toFixed(2)}s`,
        rom: `${rep.rom.toFixed(2)}`,
        tempo: rep.tempo.join('-'),
      })),
    };
  
    addSetToSession(selectedSession.id, convertedSet);
  
    setProcessedReps(prev => {
      const updated = new Set(prev);
      repsInSet.forEach(r => updated.add(r.id));
      return updated;
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📊 Set Recording</Text>
      <Text style={styles.label}>Connected Device: <Text style={styles.device}>{connectedDevice?.name || 'None'}</Text></Text>
      <Text style={styles.label}>Current Rep Count: <Text style={styles.count}>{BluetoothService.getRepCount()}</Text></Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={() => BluetoothService.sendCommand('START_RECORDING')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.stopButton]} onPress={() => BluetoothService.sendCommand('STOP_RECORDING')}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.disconnectButton]} onPress={onDisconnect}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f4f6f8',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
  },
  device: {
    fontWeight: '500',
    color: '#4A90E2',
  },
  count: {
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FFA500',
  },
  disconnectButton: {
    backgroundColor: '#D9534F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
