import React, { useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {decode as atob} from 'base-64';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
  Platform,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,

} from 'react-native/Libraries/NewAppScreen';

import { BleManager, Characteristic, Service, Device} from 'react-native-ble-plx';

const manager = new BleManager();

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const REP_COUNT_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const VELOCITY_CHAR_UUID = "";



type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): React.JSX.Element {

  const [device, setDevice] = useState<Device | null>(null);
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const [repCount, setRepCount] = useState(0);

  const highlightButton = () => {
    const [buttonPressed, setButtonPressed] = useState(false);
    <TouchableOpacity
    onPressOut ={() => setButtonPressed(true)}
    onPress = {() => setButtonPressed(false)}
    >
    </TouchableOpacity>
  }

  useEffect(() => {
    if (Platform.OS === "android"){
      console.log("Android detected");
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ])
    }
  }, [])
  
  const startScan = () => {
    console.log("Scan Started");
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      console.log(scannedDevice?.name);
      if (error) {
        console.warn(error);
        return
      }
      if (!scannedDevice?.name || scannedDevice.id){
        return
      }
      setFoundDevices((previousDevices: Device[]) => {
        const exists = previousDevices.find((d) => d.id === scannedDevice.id);
        if (exists){
          return previousDevices;
        }
        return [...previousDevices, scannedDevice];
      })
  


    })
  }

  const connectDevice = async (device: Device) => {
    manager.stopDeviceScan();
    try {
      console.log("Attemping to connect device" + device.name);
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setDevice(connectedDevice);
      
      manager.stopDeviceScan();

      subscribeToData(connectedDevice);

    } 
    catch (error) {
      console.log("Connection failed", error);
      setDevice(null);
    }

  }

  const subscribeToData = (device: Device) => {
    device.monitorCharacteristicForService(SERVICE_UUID, REP_COUNT_CHAR_UUID, (error, characteristic) => {
      if (error){
        console.warn("Unhandled error", error);
        if (error.errorCode === 201){
          console.warn("Connection Error");
          connectDevice(device);
        }
        else {
          setDevice(null);
        }
        return;
      }
      if (!characteristic) return;
      if (!characteristic.value) return;

      const value = parseInt(atob(characteristic.value), 16);
      setRepCount(value);
    })
  }

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  return (
    <View style={[backgroundStyle, {flex: 1, padding: 20}]}>
      <View>
        <Text>This is the Header</Text>
      </View>
      <View>
        <Button title="Scan for Devices" onPress={startScan}></Button>
        <Text>Scanned Devices</Text>
        <ScrollView>
        {foundDevices.map((device) => (
          <Button title={device.name ?? "Unknown"} onPress={() => connectDevice(device)}></Button>
          
        ))}
        </ScrollView>
        <Text>Connected Device: {device?.name || "None"}</Text>
        <Text>Rep Count: {repCount} </Text>
        <Text>Velocity: </Text>
      </View>
    </View>
  );
}


export default App;
