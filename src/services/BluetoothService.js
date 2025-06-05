import { BleManager } from 'react-native-ble-plx';
import { decode as atob, encode as btoa } from 'base-64';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const SET_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const REP_COUNT_CHAR_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const COMMAND_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

class BluetoothService{
    constructor() {
        this.manager = new BleManager();
        this.device = null;
        this.commandChar = null;
        this.setSummaries = [];
        this.repCount = 0;
        this.setUpdateCallback = null;
        this.repUpdateCallback = null;
        this.deviceDiscoveredCallback = null;
    }
    startScan(){
        this.manager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error || !scannedDevice?.name) return;
            if (this.deviceDiscoveredCallback) {
                this.deviceDiscoveredCallback(scannedDevice);
            }
        });
    };

    async connectDevice(device){
        this.manager.stopDeviceScan();
        try {
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            this.device = connectedDevice
        
            const services = await connectedDevice.services();
            for (const service of services) {
                const characteristics = await service.characteristics();
                for (const char of characteristics) {
                if (char.uuid.toLowerCase() === COMMAND_CHAR_UUID) {
                    this.commandChar = char;
            }}}

            this.subscribeToSetData(connectedDevice);
            this.subscribeToRepData(connectedDevice);

        } catch (error) {
            console.log('Connection failed', error);
            setDevice(null);
        }
      };
    
    subscribeToSetData(device){
        device.monitorCharacteristicForService(SERVICE_UUID, SET_CHARACTERISTIC_UUID, (error, characteristic) => {
          if (error || !characteristic?.value) return;
          console.log("Set data called.");
          try {
            const jsonString = atob(characteristic.value);
            const dataArray  = JSON.parse(jsonString);
            if (!Array.isArray(dataArray)){
              console.warn("SET payload not an array", jsonString);
              return;
            }
            const newIds = new Set(this.setSummaries.map((item) => item.id));
            const filtered = dataArray.filter((item) => !newIds.has(item.id));
            this.setSummaries = [...this.setSummaries, ...filtered];
            if (this.setUpdateCallback) this.setUpdateCallback(this.setSummaries);

          } catch (e) {
            console.warn("SET parsing error", e);
          }
        });
      };
    
      subscribeToRepData(device){
        device.monitorCharacteristicForService(SERVICE_UUID, REP_COUNT_CHAR_UUID, (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const value = parseInt(atob(characteristic.value), 10);
          this.repCount = value;

          if (this.repUpdateCallback) this.repUpdateCallback(this.repCount);
        });
      };
    
      async sendCommand(cmd){
        if (!this.commandChar) return;
        try {
          const encoded = btoa(cmd);
          await this.commandChar.writeWithResponse(encoded);
        } catch (err) {
          console.warn("Write error", err);
        }
      };
    onSetUpdate(callback) {
        this.setUpdateCallback = callback;
    }
    
    onRepUpdate(callback) {
        this.repUpdateCallback = callback;
    }
    setDeviceDiscoveredCallback(callback) {
        this.deviceDiscoveredCallback = callback;
    }      
    disconnect() {
        if (this.device) {
            this.device.cancelConnection();
            this.device = null;
        }
        this.commandChar = null;
        this.setSummaries = null;
        this.repCount = null;
    }
}
export default new BluetoothService();