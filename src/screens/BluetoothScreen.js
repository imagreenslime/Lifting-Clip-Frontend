import BluetoothService from '../services/BluetoothService'; // adjust path if needed
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';

export default function BluetoothScreen(){
    const [foundDevices, setFoundDevices] = useState([]);
    const [repCount, setRepCount] = useState(0);
    const [setSummaries, setSetSummaries] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);

    useEffect(() => {
        BluetoothService.setDeviceDiscoveredCallback((device) => {
            setFoundDevices((prev) =>
              prev.find((d) => d.id === device.id) ? prev : [...prev, device]
            );
          });
        BluetoothService.onSetUpdate(setSetSummaries);
        BluetoothService.onRepUpdate(setRepCount);
    }, [])
    return (
        <View style={{ padding: 20 }}>
          <Button title="Scan for Devices" onPress={() => BluetoothService.startScan()} />
          <ScrollView>
            {foundDevices.map((device) => (
              <Button key={device.id} title={device.name || 'Unknown'} onPress={async () => {
                await BluetoothService.connectDevice(device); 
                setConnectedDevice(device);}} />
            ))}
          </ScrollView>
          {connectedDevice && (
            <Text style={{ marginVertical: 10 }}>
                🔗 Connected to: {connectedDevice.name || 'Unnamed Device'}
            </Text>
            )}
          <Text>Reps: {repCount}</Text>
          <ScrollView>
            {setSummaries.map((s, i) => (
              <Text key={i}>
                Set {s.set}, Rep {s.rep}, Duration {s.dur}, Tempo {(s.tempo || []).join('-')}
              </Text>
            ))}
          </ScrollView>
          <Button title="Start asdiosadjaisa" onPress={() => BluetoothService.sendCommand('START_RECORDING')} />
            <Button title="Stop Recording" onPress={() => BluetoothService.sendCommand('STOP_RECORDING')} />
        </View>

    );
    
}