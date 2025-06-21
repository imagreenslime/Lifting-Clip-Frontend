// src/screens/BluetoothRecordingScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BluetoothService from '../services/BluetoothService';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { Button } from 'react-native-paper';

export default function BluetoothRecordingScreen() {
  const { addSet } = useUserSessions();
  const { connectedDevice, selectedSessionId } = useNavigation();

  const [processedReps, setProcessedReps] = useState(new Set());

  const onDisconnect = () => {
    // handle disconnect logic if needed
  };

  BluetoothService.onSetUpdate((summaries) => {
    const latestSetId = summaries[summaries.length - 1].set;

    const repsInSet = summaries.filter(
      (s) => s.set === latestSetId && !processedReps.has(s.id)
    );

    if (repsInSet.length === 0) return;

    const convertedSet = {
      id: Date.now().toString(),
      exercise: '(Enter Exercise)',
      reps: repsInSet.length,
      duration: `${repsInSet.reduce((sum, r) => sum + r.dur, 0).toFixed(2)}s`,
      repData: repsInSet.map((rep) => ({
        id: rep.id.toString(),
        duration: `${rep.dur.toFixed(2)}s`,
        rom: `${rep.rom.toFixed(2)}`,
        tempo: rep.tempo.join('-'),
      })),
    };

    addSet(selectedSessionId, convertedSet);

    setProcessedReps((prev) => {
      const updated = new Set(prev);
      repsInSet.forEach((r) => updated.add(r.id));
      return updated;
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📡 Bluetooth Set Recording</Text>

      <Text style={styles.label}>
        Device: <Text style={styles.value}>{connectedDevice?.name || 'None'}</Text>
      </Text>

      <Text style={styles.label}>
        Reps: <Text style={styles.value}>{BluetoothService.getRepCount()}</Text>
      </Text>

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          style={[styles.button, styles.startButton]}
          onPress={() => BluetoothService.sendCommand('START_RECORDING')}
        >
          Start
        </Button>

        <Button
          mode="contained"
          style={[styles.button, styles.stopButton]}
          onPress={() => BluetoothService.sendCommand('STOP_RECORDING')}
        >
          Stop
        </Button>

        <Button
          mode="contained"
          style={[styles.button, styles.disconnectButton]}
          onPress={onDisconnect}
        >
          Disconnect
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#aaa',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 6,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FFA500',
  },
  disconnectButton: {
    backgroundColor: '#D9534F',
  },
});
