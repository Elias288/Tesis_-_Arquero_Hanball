/*
 * Este contexto comparte entre todos sus componentes hijos las lista de jugadores y
 * rutinas guardadas
 */
import { ReactNode, createContext, useContext } from 'react';

import useLocalStorage, { LocalStorageType } from '../utils/useLocalStorage';

const LocalStorageContext = createContext<LocalStorageType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LocalStorageContext.Provider value={useLocalStorage()}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useCustomLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage debe ser utilizado dentro de un LocalStorageProvider');
  }
  return context;
};

export default LocalStorageProvider;
