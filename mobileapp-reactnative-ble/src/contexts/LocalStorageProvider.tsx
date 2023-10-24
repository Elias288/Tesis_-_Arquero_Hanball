/*
 * Este contexto comparte entre todos sus componentes hijos las lista de jugadores y
 * rutinas guardadas
 */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { JugadorType } from '../data/JugadoresType';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface useLocalStorageType {
  jugadores: JugadorType[];
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (id: number) => void;
}

const LocalStorageContext = createContext<useLocalStorageType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jugadores, setJugadores] = useState<Array<JugadorType>>([]);
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    findJugadores();
  }, []);

  const findJugadores = async () => {
    try {
      const value = await AsyncStorage.getItem('jugadores');
      if (value !== null) setJugadores(JSON.parse(value));
    } catch (e) {
      console.log(e);
    }
  };

  const pushJugador = async (newJugador: JugadorType) => {
    setJugadores([...jugadores, newJugador]);
    await AsyncStorage.setItem('jugadores', JSON.stringify([...jugadores, newJugador]));
  };

  const popJugador = async (popJugadorId: number) => {
    const newJugadoresList = jugadores.filter((j) => j.id !== popJugadorId);
    setJugadores(newJugadoresList);
    await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresList));
  };

  const clearJugadoresDB = async () => {
    console.log('db clear');
    await AsyncStorage.setItem('jugadores', JSON.stringify([]));
  };

  return (
    <LocalStorageContext.Provider value={{ jugadores, pushJugador, clearJugadoresDB, popJugador }}>
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
