/*
 * Este contexto comparte entre todos sus componentes hijos la logica de los estados de useBLE.tsx y sus datos
 */

import { createContext, FC, ReactNode, useContext } from 'react';
import useBLE from '../components/useBLE';
import { BleError, Device } from 'react-native-ble-plx';

type CustomData = {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  disconnectFromDevice: () => void;
  sendData(device: Device, msg: string): Promise<void>;
  connectToDevice(device: Device): void;
  connectedDevice: Device | undefined;
  BLEmsg: string | BleError;
  espStatus: Boolean;
  receivedMSG: string;
};

const BLEContext = createContext<CustomData | undefined>(undefined);

export function useCustomBLEProvider() {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useCustomDataCtx debe ser utilizado dentro de un CustomDataProvider');
  }
  return context;
}

const BleContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    connectToDevice,
    sendData,
    BLEmsg,
    connectedDevice,
    espStatus,
    receivedMSG,
  } = useBLE();

  return (
    <BLEContext.Provider
      value={{
        requestPermissions,
        scanAndConnectPeripherals,
        disconnectFromDevice,
        connectToDevice,
        sendData,
        BLEmsg,
        connectedDevice,
        espStatus,
        receivedMSG,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};

export default BleContext;
