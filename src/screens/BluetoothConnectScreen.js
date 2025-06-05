// src/screens/BluetoothConnectScreen.js
import BluetoothService from '../services/BluetoothService'; // adjust path if needed
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function BluetoothScreen({ onConnect, connectedDevice, onDisconnect}){
    const [foundDevices, setFoundDevices] = useState([]);


    useEffect(() => {
        BluetoothService.setDeviceDiscoveredCallback((device) => {
            setFoundDevices((prev) =>
              prev.find((d) => d.id === device.id) ? prev : [...prev, device]
            );
          });
    }, [])
    return (
        <View style={{ padding: 20 }}>
          <Button title="Scan for Devices" onPress={() => BluetoothService.startScan()} />
          <ScrollView>
            {foundDevices.map((device) => (
              <Button key={device.id} title={device.name || 'Unknown'} onPress={async () => {
                await BluetoothService.connectDevice(device); 
                onConnect(device);}} />
            ))}
          </ScrollView>
          <Button title="Disconnect" onPress={onDisconnect} />
          <Text>Connected Device: {connectedDevice?.name || "None"}</Text>
        </View>

    );
    
}