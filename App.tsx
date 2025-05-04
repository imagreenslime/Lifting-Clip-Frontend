import React, { useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
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
  const [repCount, setRepCount] = useState(0);
  const [velocity, setVelocity] = useState(0);

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

      if (scannedDevice?.name === "RepCounter"){
        console.log("scanned")
        manager.stopDeviceScan();
        connectDevice(scannedDevice);
      }
    })
  }

  const connectDevice = async (device: Device) => {
    console.log("Attemping to connected device");
    const connectedDevice = await device.connect();
    await connectedDevice.discoverAllServicesAndCharacteristics();
    setDevice(connectedDevice);
    subscribeToData(connectedDevice);
  }

  const subscribeToData = (device: Device) => {
    console.log("Getting Data");
    device.monitorCharacteristicForService(SERVICE_UUID, REP_COUNT_CHAR_UUID, (error, characteristic) => {
      if (error){
        console.warn(error);
        return;
      }
      if (!characteristic) return;
      if (!characteristic.value) return;

      const value = parseInt(characteristic.value, 16);
      setRepCount(value);
    })
  }

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const safePadding = '5%';

  return (
    <View style={[backgroundStyle, {flex: 1, padding: 20}]}>
      <Button title="Start scan" onPress={startScan}></Button>

      <Text>Connected Device: {device?.name || "None"}</Text>
      <ScrollView
        style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header/>
        </View>
        <Text>Rep Count: {repCount} </Text>
        <Text>Velocity: </Text>
      </ScrollView>
    </View>
  );
}

export default App;
