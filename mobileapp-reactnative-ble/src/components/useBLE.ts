import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

import * as ExpoDevice from 'expo-device';

// import base64 from "react-native-base64";

const ESP32_NAME = 'ESP32-server';
const ESP32_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const ESP32_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  sendData(device: Device, msg: string): Promise<void>;
  connectedDevice: Device | null;
  espDevice: Device | undefined;
  BLEmsg: string | BleError;
  espStatus: Boolean;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [espDevice, setEspDevice] = useState<Device>();
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bleStatus, setbleStatus] = useState<Boolean>(false);
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

  const scanAndConnectPeripherals = () => {
    const suscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        setbleStatus(true);
        // ****************************** Si el bluetooth está a encendido ******************************
        bleManager.stopDeviceScan();
        setMsg('Scanning...');
        setEspDevice(undefined);

        let espdevice: Device | undefined = undefined;
        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            return setMsg(error);
          }

          // *********************************** Busca el dispositivo ***********************************

          if (device) {
            device.name !== null ?? console.log(`${device.name} ${device.serviceUUIDs}`);

            if (device.name?.includes(ESP32_NAME)) {
              bleManager.stopDeviceScan();
              setEspDevice(device);
              setMsg('Esp32 found');
              espdevice = device;

              // conecta el dispositivo
              device.isConnected().then((state) => {
                if (!state) {
                  console.log('connecting to device');

                  connectToDevice(device);
                } else {
                  setConnectedDevice(device);

                  bleManager.connectedDevices([ESP32_SERVICE_UUID]).then((device) => {
                    console.log(device);
                  });

                  console.log('already connected to device');
                }
              });
            }
          }
        });
        suscription.remove();

        // ************************* Detiene el escaneo despues de 10 segundos *************************
        setTimeout(() => {
          if (espdevice === undefined) {
            console.log('time out. -1');
            setMsg('Time out. Esp32 not found');
            bleManager.stopDeviceScan();
            return;
          }
          console.log('time out. 0');
        }, 10000);
      } else if (state === 'PoweredOff') {
        // ******************************* si el bluetooth está a pagado *******************************
        setbleStatus(false);
        setMsg('Bluetooth off');
      }
    }, true);
  };

  const connectToDevice = async (device: Device) => {
    device
      .connect()
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(async (device) => {
        const services = device.services();
        const serviceUUIs = (await services).map((service) => service.uuid);
        setConnectedDevice(device);
        console.log(`Conectado a: ${device.id}`);

        sendData(device, 'react native conectado');
      })
      .catch((e) => {
        console.log('FAILED TO CONNECT', e);
        setMsg(`FAILED TO CONNECT ${e}`);
        setEspDevice(undefined);
      });
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setMsg('ESP32-server disconnected');
    }
  };

  const sendData = async (device: Device, msg: string) => {
    const messageChunks: Array<string> = formatMSG(device.mtu, msg);

    try {
      messageChunks.map((msgChunk) => {
        const msgBase64 = base64.encode(msgChunk);
        console.log(`sending \"${msgChunk} (${msgBase64})\" to: ${device.name} ${device.mtu}`);
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

  const formatMSG = (deviceMtuSize: number, message: string): Array<string> => {
    const formatedMSG = `${message}\n`;
    const chunkSize = deviceMtuSize - 3;
    const chunks = [];

    for (let i = 0; i < formatedMSG.length; i += chunkSize) {
      chunks.push(formatedMSG.slice(i, i + chunkSize));
    }

    return chunks;
  };

  return {
    scanAndConnectPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    sendData,
    connectedDevice,
    espDevice,
    BLEmsg,
    espStatus: bleStatus,
  };
}

export default useBLE;
