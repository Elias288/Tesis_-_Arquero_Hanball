/*
 * Este contexto comparte entre todos sus componentes hijos las lista de jugadores y
 * rutinas guardadas
 */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { JugadorType } from '../data/JugadoresType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RutinaType } from '../data/RutinasType';

interface useLocalStorageType {
  jugadores: Array<JugadorType>;
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (jugadorId: number) => void;
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: number) => void;
}

const LocalStorageContext = createContext<useLocalStorageType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jugadores, setJugadores] = useState<Array<JugadorType>>([]);
  const [rutinas, setRutinas] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    findJugadores();
    findRutinas();
  }, []);

  // ****************************************** Jugadores ******************************************
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

  // ****************************************** Rutinas ******************************************
  const findRutinas = async () => {
    try {
      const value = await AsyncStorage.getItem('rutinas');
      if (value !== null) setRutinas(JSON.parse(value));
    } catch (e) {
      console.log(e);
    }
  };

  const pushRutina = async (newRutina: RutinaType) => {
    setRutinas([...rutinas, newRutina]);
    await AsyncStorage.setItem('rutinas', JSON.stringify([...rutinas, newRutina]));
  };

  const popRutina = async (popRutinaId: number) => {
    const newRutinaList = rutinas.filter((j) => j.id !== popRutinaId);
    setRutinas(newRutinaList);
    await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinaList));
  };

  return (
    <LocalStorageContext.Provider
      value={{
        jugadores,
        pushJugador,
        clearJugadoresDB,
        popJugador,
        rutinas,
        popRutina,
        pushRutina,
      }}
    >
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
