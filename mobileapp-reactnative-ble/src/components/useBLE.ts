import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';

import * as ExpoDevice from 'expo-device';

// import base64 from "react-native-base64";

const ESP32_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const ESP32_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  espDevice: Device | undefined;
  BLEmsg: string | BleError;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [espDevice, setEspDevice] = useState<Device>();
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [BLEmsg, setMsg] = useState<string | BleError>('');

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  let scannTimeOut = new Date();
  const scanAndConnectPeripherals = () => {
    const suscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        setMsg('Scanning...');
        setEspDevice(undefined);

        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            setMsg(error);
            return;
          }

          // ************* calcula el tiempo de escaneo y lo detiene despues de 50 segundos *************
          let endTime = new Date();
          const seconds = calculateTime(scannTimeOut, endTime);

          if (seconds > 50) {
            console.log('scan stoped');
            bleManager.stopDeviceScan();

            if (!espDevice) {
              setMsg('Esp32 not found');
              disconnectFromDevice();
            }
          }

          // *********************************** busca el dispositivo ***********************************
          console.log(JSON.stringify({ uuid: device?.serviceUUIDs, name: device?.name }));

          var espdevice: Device | undefined = undefined;
          if (device && device.serviceUUIDs?.includes(ESP32_UUID)) {
            bleManager.stopDeviceScan();
            setEspDevice(device);
            setMsg('Esp32 found');
            espdevice = device;

            // conecta el dispositivo
            /*
             * al conectar y actualizar la app, el esp deja de aparecer, puede ser error de
             * react-native o de arduino
             */
            // connectToDevice(device);
          }
        });
        suscription.remove();
      }
    }, true);
  };

  const calculateTime = (startTime: Date, endTime: Date): number =>
    Math.round((endTime.getTime() - startTime.getTime()) / 100);

  const connectToDevice = async (device: Device) => {
    console.log('conect to: ', device.serviceUUIDs);
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      console.log(`${device.name} CONNECTED!`);
      setMsg(`${device.name} CONNECTED!`);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
      setMsg(`FAILED TO CONNECT ${e}`);
      setEspDevice(undefined);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setMsg('');
      setEspDevice(undefined);
    }
  };

  return {
    scanAndConnectPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    espDevice,
    BLEmsg,
  };
}

export default useBLE;
