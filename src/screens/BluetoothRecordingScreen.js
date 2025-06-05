// src/screens/BluetoothRecordingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity} from 'react-native';
import BluetoothService from '../services/BluetoothService';

export default function BluetoothRecordingScreen({ device, onDisconnect }) {
  const [repCount, setRepCount] = useState(0);
  const [setSummaries, setSetSummaries] = useState([]);

  useEffect(() => {
    BluetoothService.onSetUpdate(setSetSummaries);
    BluetoothService.onRepUpdate(setRepCount);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Connected to: {device?.name || "N/A"}</Text>
      <Text>Reps: {repCount}</Text>
      <Button title="Start Recording" onPress={() => BluetoothService.sendCommand('START_RECORDING')} />
      <Button title="Stop Recording" onPress={() => BluetoothService.sendCommand('STOP_RECORDING')} />
      <Button title="Disconnect" onPress={onDisconnect} />
    </View>
  );
}
