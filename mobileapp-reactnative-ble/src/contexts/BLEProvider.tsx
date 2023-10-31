/*
 * Este contexto comparte entre todos sus componentes hijos la logica de los estados de
 * useBLE.tsx y sus datos
 */
import { createContext, ReactNode, useContext } from 'react';
import useBLE, { BluetoothLowEnergyApi } from '../utils/useBLE';

const BLEContext = createContext<BluetoothLowEnergyApi | undefined>(undefined);

const BleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <BLEContext.Provider value={useBLE()}>{children}</BLEContext.Provider>;
};

export function useCustomBLE() {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useCustomBLE debe ser utilizado dentro de un BleProvider');
  }
  return context;
}

export default BleProvider;
