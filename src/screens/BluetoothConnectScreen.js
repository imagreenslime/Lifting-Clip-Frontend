// src/screens/BluetoothConnectScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import BluetoothService from '../services/BluetoothService';
import { useApp } from '../providers/NavigationContext';

export default function BluetoothScreen({}) {

  const {
    setConnectedDevice, setView, connectedDevice
  } = useApp()

  const onConnect=((device) => {
    setConnectedDevice(device);
    setView('BluetoothRecording');
  })

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

      <TouchableOpacity style={styles.scanButton} onPress={() => BluetoothService.startScan()}>
        <Text style={styles.buttonText}>Scan for Devices</Text>
      </TouchableOpacity>

      <ScrollView style={styles.deviceList}>
        {foundDevices.length === 0 ? (
          <Text style={styles.noDeviceText}>No devices found.</Text>
        ) : (
          foundDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceButton}
              onPress={async () => {
                await BluetoothService.connectDevice(device);
                onConnect(device);
              }}
            >
              <Text style={styles.deviceName}>{device.name || 'Unnamed Device'}</Text>
              <Text style={styles.deviceId}>{device.id}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>

      <Text style={styles.connectedLabel}>
        Connected Device: <Text style={styles.connectedDevice}>{connectedDevice?.name || 'None'}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  disconnectButton: {
    backgroundColor: '#D9534F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deviceList: {
    marginTop: 10,
    marginBottom: 20,
  },
  deviceButton: {
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
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
    textAlign: 'center',
  },
  connectedDevice: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
