import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

import * as ExpoDevice from 'expo-device';
import {
  BLUETOOTHCONNECTED,
  BLUETOOTHOFF,
  BLUETOOTHNOTCONNECTED,
  BLUETOOTHNOTSTATUS,
  BLUETOOTHTIMEOUT,
  BLUETOOTHERROR,
  BLUETOOTHDISCONNECTED,
} from '../utils/BleCodes';
import { RutinaType, secuenciaType } from '../data/ListaRutinas.data';

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
  secuenciaToString(secuencia: Array<secuenciaType>): string;
  selectRutina(rutina: RutinaType): void;
  runGame: (run: boolean) => void;
  stringToSecuencia: (secuencia: string) => Array<secuenciaType>;
  connectedDevice: Device | undefined;
  espDevice: Device | undefined;
  BLEmsg: string;
  BLECode: number;
  espConnectedStatus: Boolean;
  isScanningLoading: Boolean;
  receivedMSG: string;
  BLEPowerStatus: Boolean;
  selectedRutina: RutinaType | undefined;
  isGameRunning: boolean;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);

  const [espDevice, setEspDevice] = useState<Device>(); // objeto device
  const [connectedDevice, setConnectedDevice] = useState<Device | undefined>(); // objeto device si está conectado

  const [BLEConectedStatus, setBLEConnectedStatus] = useState<Boolean>(false); // estado del esp, conectado true, no conectado false
  const [BLEPowerStatus, setBLEPowerStatus] = useState<Boolean>(false);
  const [receivedMSG, setReceivedMSG] = useState<string>(''); // mensaje recibido desde el servidor BLE
  let receivedArrayMessage: Array<string> = []; // paquetes recibidos
  const [selectedRutina, setSelectedRutina] = useState<RutinaType>();
  const [isScanningLoading, setScanningLoading] = useState<Boolean>(false); // estado del escaner
  const [BLEmsg, setBLEMsg] = useState<string>(''); // mensajes de estado
  const [BLECode, setBLECode] = useState<number>(BLUETOOTHNOTSTATUS); // codigo de estado y resultados
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);

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
        setBLEPowerStatus(true);
        setScanningLoading(true);

        // ****************************** Si el bluetooth está a encendido ******************************
        bleManager.stopDeviceScan();

        setBLEMsg('Scanning...');
        setEspDevice(undefined);

        let espdevice: Device | undefined;
        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            setBLEMsg(`${error}`);
            setBLECode(BLUETOOTHERROR);
            console.log(`DeviceScanError - BLECode: ${BLUETOOTHERROR}`);

            bleManager.stopDeviceScan();
            return () => suscription.remove();
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
                  setBLEConnectedStatus(true);
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

            setBLEMsg('Tiempo agotado. Esp32 no encontrado');
            setBLECode(BLUETOOTHTIMEOUT);
            console.log(`Time out - BLECode: ${BLUETOOTHTIMEOUT}`);
            bleManager.stopDeviceScan();
            return;
          }
        }, 10000);
      } else if (state === 'PoweredOff') {
        // ******************************* si el bluetooth está a pagado *******************************
        setBLEConnectedStatus(false);
        setBLEPowerStatus(false);
        setScanningLoading(false);

        setBLEMsg('Bluetooth apagado');
        setBLECode(BLUETOOTHOFF);
        console.log(`PoweredOff - BLECode: ${BLUETOOTHOFF}`);
        bleManager.stopDeviceScan();
        suscription.remove();
      }
    }, true);
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
          readData(connectedDevice);
          setConnectedDevice(connectedDevice);

          setBLEMsg('Dispositivo conectado');
          setBLECode(BLUETOOTHCONNECTED);
          console.log(`connectToDevice - BLECode: ${BLUETOOTHCONNECTED}`);

          setScanningLoading(false);
          sendData(connectedDevice, 'clientMsg: cliente conectado');
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
      setBLEConnectedStatus(false);
      setReceivedMSG('');

      setBLEMsg('Dispositivo desconectado');
      setBLECode(BLUETOOTHDISCONNECTED);
      console.log(`disconnectFromDevice - BLECode: ${BLUETOOTHDISCONNECTED}`);

      setReceivedMSG('');
    }
  };

  const sendData = async (connectedDevice: Device, msg: string) => {
    /*
     * Esta funcion se encarga de empaquetar los mensajes y enviarlos al servidor BLE
     */
    if (connectedDevice) {
      const messageChunks: Array<string> = packMSG(connectedDevice.mtu, msg);

      try {
        messageChunks.map((msgChunk) => {
          const msgBase64 = base64.encode(msgChunk);
          if (connectedDevice) {
            connectedDevice
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
    } else {
      setBLEMsg('Dispositivo no conectado');
      setBLECode(BLUETOOTHNOTCONNECTED);
      console.log(`sendDataNotConnected - BLECode: ${BLUETOOTHNOTCONNECTED}`);
    }
  };

  const secuenciaToString = (secuencia: Array<secuenciaType>): string => {
    /*
     * formatea una secuencia en string "secuence:1,1000;2,2000;3,3000;"
     */
    return (
      'secuence:' +
      secuencia.map((item) => `${+item.ledId - 1},${item.time * 1000}`).join(';') +
      ';'
    );
  };

  const stringToSecuencia = (secuenciaString: string) => {
    const elements = secuenciaString.split(';');
    const newSecuencia: Array<secuenciaType> = [];

    elements.forEach((element, index) => {
      if (element != '' && selectedRutina) {
        const [ledId, time] = element.split(',');
        newSecuencia.push({
          id: index.toString(),
          ledId: ledId,
          time: selectedRutina.secuencia[index].time,
          resTime: time != '-' ? +time / 1000 : '-',
        });
      }
    });

    return newSecuencia;
  };

  const readData = async (device: Device) => {
    /*
     * Despaqueta los mensajes recibidos del servidor BLE
     */

    if (device) {
      // escucha activa al servidor BLE
      device.monitorCharacteristicForService(
        ESP32_SERVICE_UUID,
        ESP32_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (characteristic !== null) {
            const val = unpackMSG(base64.decode(characteristic.value ?? ''));
            if (val != '') {
              // console.log('monitorVal:' + val);
              setReceivedMSG(val);
              receivedArrayMessage = [];
            }
          }
        }
      );

      // escucha el primer mensaje del servidor BLE
      device
        .readCharacteristicForService(ESP32_SERVICE_UUID, ESP32_CHARACTERISTIC_UUID)
        .then((valec) => {
          const val = unpackMSG(base64.decode(valec.value ?? ''));
          if (val != '') {
            // console.log('readVal:' + val);
            setReceivedMSG(val);
            receivedArrayMessage = [];
          }
        });
    } else {
      setBLEMsg('not connected device');
    }
  };

  const packMSG = (deviceMtuSize: number, message: string): Array<string> => {
    /*
     * Empaqueta los mensajes a enviar al servidor BLE
     */

    const formatedMSG = `${message}~`;
    const chunkSize = deviceMtuSize - 3;
    const chunks = [];

    for (let i = 0; i < formatedMSG.length; i += chunkSize) {
      chunks.push(formatedMSG.slice(i, i + chunkSize));
    }

    return chunks;
  };

  const unpackMSG = (message: string) => {
    /*
     * Funcion que desempaqueta un mensaje recibido del servidor BLE
     * Formato de mensaje: "funcion1:dato1^funcion2:dato2^...~"
     */

    for (let i = 0; i < message.length; i++) {
      let receivedChar = message.charAt(i);

      if (receivedChar == '~') {
        if (receivedArrayMessage.join('') != '') {
          return receivedArrayMessage.join('');
        }
        return 'null';
      } else {
        receivedArrayMessage.push(receivedChar);
      }
    }
    return '';
  };

  const cleanBLECode = () => {
    setBLECode(BLUETOOTHNOTSTATUS);
  };

  return {
    scanAndConnectPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    sendData,
    cleanBLECode,
    initBle,
    secuenciaToString,
    selectRutina: setSelectedRutina,
    runGame: setIsGameRunning,
    stringToSecuencia,
    connectedDevice,
    espDevice,
    BLEmsg,
    BLECode,
    isScanningLoading,
    espConnectedStatus: BLEConectedStatus,
    receivedMSG,
    BLEPowerStatus,
    selectedRutina,
    isGameRunning,
  };
}

export default useBLE;
