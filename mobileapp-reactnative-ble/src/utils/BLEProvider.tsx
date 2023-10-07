/*
 * Este contexto comparte entre todos sus componentes hijos la logica de los estados de useBLE.tsx y sus datos
 */
import { createContext, ReactNode, useContext } from 'react';
import useBLE, { BluetoothLowEnergyApi } from '../components/useBLE';

const BLEContext = createContext<BluetoothLowEnergyApi | undefined>(undefined);

export function useCustomBLEProvider() {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useCustomDataCtx debe ser utilizado dentro de un CustomDataProvider');
  }
  return context;
}

const BleContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <BLEContext.Provider value={useBLE()}>{children}</BLEContext.Provider>;
};

export default BleContext;
