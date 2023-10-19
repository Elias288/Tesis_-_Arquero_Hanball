import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

import * as ExpoDevice from 'expo-device';
import {
  BLUETOOTHCONNECTED,
  BLUETOOTHERROR,
  BLUETOOTHNOTCONNECTED,
  BLUETOOTHNOTSTATUS,
  BLUETOOTHTIMEOUT,
} from '../utils/BleCodes';
import { secuenciaType } from '../data/ListaRutinas.data';

const ESP32_NAME = 'ESP32-server';
const ESP32_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const ESP32_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

export interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  connectToDevice(deviceId: Device): Promise<void>;
  disconnectFromDevice(): void;
  sendData(device: Device, msg: string): Promise<void>;
  cleanBLECode(): void;
  initBle(): void;
  formatRutina(secuencia: Array<secuenciaType>): string;
  connectedDevice: Device | undefined;
  espDevice: Device | undefined;
  BLEmsg: string;
  BLECode: number;
  espStatus: Boolean;
  isScanningLoading: Boolean;
  receivedMSG: string;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);

  const [espDevice, setEspDevice] = useState<Device>(); // objeto device
  const [connectedDevice, setConnectedDevice] = useState<Device | undefined>(); // objeto device si está conectado

  const [BLEStatus, setBLEStatus] = useState<Boolean>(false); // estado del esp, conectado true, no conectado false
  const [receivedMSG, setReceivedMSG] = useState<string>(''); // mensaje recibido desde el servidor BLE
  const [isScanningLoading, setScanningLoading] = useState<Boolean>(false); // estado del escaner
  const [BLEmsg, setBLEMsg] = useState<string>(''); // mensajes de estado
  const [BLECode, setBLECode] = useState<number>(BLUETOOTHNOTSTATUS); // codigo de estado y resultados

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

  const scanAndConnectPeripherals = () => {
    const suscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        setBLEStatus(true);
        setScanningLoading(true);

        // ****************************** Si el bluetooth está a encendido ******************************
        bleManager.stopDeviceScan();
        setBLECode(0);
        setBLEMsg('Scanning...');
        setEspDevice(undefined);

        let espdevice: Device | undefined;
        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            setBLECode(BLUETOOTHERROR);
            setBLEMsg(`${error}`);
            return;
          }

          // *********************************** Busca el dispositivo ***********************************
          if (device) {
            if (device.name?.includes(ESP32_NAME)) {
              bleManager.stopDeviceScan();
              setEspDevice(device);
              setBLEMsg('Esp32 found');
              espdevice = device;

              // conecta el dispositivo
              device.isConnected().then((state) => {
                if (!state) {
                  connectToDevice(device);
                } else {
                  setConnectedDevice(device);
                  bleManager.connectedDevices([ESP32_SERVICE_UUID]).then((device) => {
                    console.log(device);
                  });
                }
              });
            }
          }
        });

        // ************************* Detiene el escaneo despues de 10 segundos *************************
        setTimeout(() => {
          if (espdevice === undefined) {
            bleManager.stopDeviceScan();
            setScanningLoading(false);
            setBLEMsg('Time out. Esp32 not found');
            setBLECode(BLUETOOTHTIMEOUT);
            return;
          }
        }, 10000);
      } else if (state === 'PoweredOff') {
        // ******************************* si el bluetooth está a pagado *******************************
        setBLEStatus(false);
        setScanningLoading(false);
        setBLEMsg('Bluetooth off');
        setBLECode(BLUETOOTHNOTCONNECTED);
      }
    }, true);
    return () => suscription.remove();
  };

  const initBle = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
    }
  };

  const connectToDevice = async (device: Device) => {
    device
      .connect()
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((connectedDevice) => {
        if (connectedDevice) {
          setConnectedDevice(connectedDevice);
          readData(connectedDevice);
          sendData(connectedDevice, 'clientMsg: react native conectado');
          setBLEMsg('connected');
          setBLECode(BLUETOOTHCONNECTED);
          setScanningLoading(false);
        }
      })
      .catch((e) => {
        console.log('FAILED TO CONNECT', e);
        setBLEMsg(`FAILED TO CONNECT ${e}`);
        setEspDevice(undefined);
      });
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(undefined);
      setBLEMsg('Disconnected');
      setBLEStatus(false);
      setReceivedMSG('');
    }
  };

  const sendData = async (device: Device, msg: string) => {
    const messageChunks: Array<string> = formatMSG(device.mtu, msg);

    try {
      messageChunks.map((msgChunk) => {
        const msgBase64 = base64.encode(msgChunk);
        if (device) {
          device
            .writeCharacteristicWithoutResponseForService(
              ESP32_SERVICE_UUID,
              ESP32_CHARACTERISTIC_UUID,
              msgBase64
            )
            .catch((error) => {
              console.log('error in writing data');
              console.log(error);
            });
        }
      });
    } catch (error) {
      console.log('error sending data');
    }
  };

  const formatRutina = (secuencia: Array<secuenciaType>): string => {
    // result "secuence:1,1000;2,2000;3,3000;"
    return (
      'secuence:' + secuencia.map((item) => `${item.ledId},${item.time * 1000}`).join(';') + ';'
    );
  };

  const readData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        ESP32_SERVICE_UUID,
        ESP32_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (characteristic !== null) {
            setReceivedMSG(base64.decode(characteristic.value ?? ''));
          }
        }
      );

      device
        .readCharacteristicForService(ESP32_SERVICE_UUID, ESP32_CHARACTERISTIC_UUID)
        .then((valec) => {
          setReceivedMSG(base64.decode(valec.value ?? ''));
        });
    } else {
      setBLEMsg('not connected device');
    }
  };

  const formatMSG = (deviceMtuSize: number, message: string): Array<string> => {
    const formatedMSG = `${message}\n`;
    const chunkSize = deviceMtuSize - 3;
    const chunks = [];

    for (let i = 0; i < formatedMSG.length; i += chunkSize) {
      chunks.push(formatedMSG.slice(i, i + chunkSize));
    }

    return chunks;
  };

  const cleanBLECode = () => {
    setBLECode(0);
  };

  return {
    scanAndConnectPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    sendData,
    cleanBLECode,
    initBle,
    formatRutina,
    connectedDevice,
    espDevice,
    BLEmsg,
    BLECode,
    isScanningLoading,
    espStatus: BLEStatus,
    receivedMSG,
  };
}

export default useBLE;
