// src/screens/BluetoothConnectScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import BluetoothService from '../services/BluetoothService';
import { useNavigation } from '../context/NavigationContext';
import { Button } from 'react-native-paper';

export default function BluetoothConnectScreen() {
  const { setConnectedDevice, setView, connectedDevice } = useNavigation();

  const onConnect = (device) => {
    setConnectedDevice(device);
    setView('BluetoothRecording');
  };

  const [foundDevices, setFoundDevices] = useState([]);

  const handleDisconnect = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
      } catch (error) {
        console.warn('Failed to disconnect:', error);
      }
    }
    BluetoothService.disconnect();
    setConnectedDevice(null);
  };

  useEffect(() => {
    BluetoothService.setDeviceDiscoveredCallback((device) => {
      setFoundDevices((prev) =>
        prev.find((d) => d.id === device.id) ? prev : [...prev, device]
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔵 Bluetooth Manager</Text>

      <Button
        mode="contained"
        style={styles.scanButton}
        onPress={() => BluetoothService.startScan()}
      >
        Scan for Devices
      </Button>

      <ScrollView style={styles.deviceList}>
        {foundDevices.length === 0 ? (
          <Text style={styles.noDeviceText}>No devices found.</Text>
        ) : (
          foundDevices.map((device) => (
            <Button
              key={device.id}
              mode="outlined"
              style={styles.deviceButton}
              textColor="#fff"
              onPress={async () => {
                await BluetoothService.connectDevice(device);
                onConnect(device);
              }}
            >
              {device.name || 'Unnamed Device'}\n{device.id}
            </Button>
          ))
        )}
      </ScrollView>

      <Button
        mode="contained"
        style={styles.disconnectButton}
        onPress={handleDisconnect}
      >
        Disconnect
      </Button>

      <Text style={styles.connectedLabel}>
        Connected Device:{' '}
        <Text style={styles.connectedDevice}>{connectedDevice?.name || 'None'}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#4A90E2',
    marginBottom: 16,
  },
  disconnectButton: {
    backgroundColor: '#D9534F',
    marginTop: 12,
  },
  deviceList: {
    flex: 1,
    marginBottom: 16,
  },
  deviceButton: {
    borderColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 10,
  },
  noDeviceText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  connectedLabel: {
    marginTop: 16,
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  connectedDevice: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
