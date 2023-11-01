/*
 * Este contexto comparte entre todos sus componentes hijos las lista de jugadores y
 * rutinas guardadas
 */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { JugadorType } from '../data/JugadoresType';
import { RutinaType } from '../data/RutinasType';

interface useLocalStorageType {
  jugadores: Array<JugadorType>;
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (jugadorId: string) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (
    jugadorName: string | undefined,
    jugadorId: string | undefined
  ) => JugadorType | undefined;
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: string) => void;
  updateRutina: (newRutina: RutinaType) => void;
  findRutina: (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ) => RutinaType | undefined;
  clearRutinasDB: () => void;
  rutinasRealizadas: Array<RutinaType>;
  pushRutinaRealizada: (newRutina: RutinaType) => void;
  popRutinaRealizada: (rutinaId: string) => void;
  clearRutinasRealizadas: () => void;
  getRutinasJugadasDeJugador: (jugadorId: string) => Array<RutinaType>;
}

const LocalStorageContext = createContext<useLocalStorageType | undefined>(undefined);

const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jugadores, setJugadores] = useState<Array<JugadorType>>([]);
  const [rutinas, setRutinas] = useState<Array<RutinaType>>([]);
  const [rutinasRealizadas, setRutinasRealizadas] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    listAllJugadores();
    ListAllRutinas();
    listAllRutinasRealizadas();
  }, []);

  // ****************************************** Jugadores ******************************************
  const listAllJugadores = async () => {
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

  const popJugador = async (popJugadorId: string) => {
    // borra rutinas realizadas por jugador
    const rutinasDeJugador = getRutinasJugadasDeJugador(popJugadorId);
    rutinasDeJugador.forEach((rr) => popRutinaRealizada(rr.id));

    // borra jugador
    const newJugadoresList = jugadores.filter((j) => j.id !== popJugadorId);
    setJugadores(newJugadoresList);
    await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresList));
  };

  const updateJugador = async (newJugador: JugadorType) => {
    const jugadorIndex = jugadores.findIndex((jugador) => jugador.id === newJugador.id);

    if (jugadorIndex !== -1) {
      const newJugadores = [...jugadores];
      newJugadores[jugadorIndex] = newJugador;
      setJugadores(newJugadores);
      await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadores));
    }
  };

  const findJugador = (
    jugadorName: string | undefined,
    jugadorId: string | undefined
  ): JugadorType | undefined => {
    if (jugadorName != undefined) return jugadores.find((jugador) => jugador.name == jugadorName);
    if (jugadorId != undefined) return jugadores.find((jugador) => jugador.id == jugadorId);
    return undefined;
  };

  const clearJugadoresDB = async () => {
    console.log('db clear');
    setJugadores([]);
    await AsyncStorage.setItem('jugadores', JSON.stringify([]));
  };

  // ****************************************** Rutinas ******************************************
  const ListAllRutinas = async () => {
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

  const popRutina = async (popRutinaId: string) => {
    const newRutinaList = rutinas.filter((j) => j.id !== popRutinaId);
    setRutinas(newRutinaList);
    await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinaList));
  };

  const updateRutina = async (newRutina: RutinaType) => {
    const rutinaIndex = rutinas.findIndex((rutina) => rutina.id === newRutina.id);

    if (rutinaIndex !== -1) {
      const newRutinas = [...rutinas];
      newRutinas[rutinaIndex] = newRutina;
      setRutinas(newRutinas);
      await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinas));
    }
  };

  const findRutina = (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ): RutinaType | undefined => {
    if (rutinaTitle !== undefined) return rutinas.find((rutina) => rutina.title == rutinaTitle);
    if (rutinaId !== undefined) return rutinas.find((rutina) => rutina.id == rutinaId);
    return undefined;
  };

  const clearRutinasDB = async () => {
    console.log('db clear');
    setRutinas([]);
    await AsyncStorage.setItem('rutinas', JSON.stringify([]));
  };
  // ************************************ Rutinas Realizadas ************************************
  const listAllRutinasRealizadas = async () => {
    try {
      const value = await AsyncStorage.getItem('rutinasRealizadas');
      if (value !== null) setRutinasRealizadas(JSON.parse(value));
    } catch (error) {
      console.log(error);
    }
  };

  const pushRutinaRealizada = async (newRutina: RutinaType) => {
    setRutinasRealizadas([...rutinasRealizadas, newRutina]);
    await AsyncStorage.setItem(
      'rutinasRealizadas',
      JSON.stringify([...rutinasRealizadas, newRutina])
    );
  };

  const popRutinaRealizada = async (popRutinaId: string) => {
    const newRutinaList = rutinasRealizadas.filter((j) => j.id !== popRutinaId);
    setRutinasRealizadas(newRutinaList);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify(newRutinaList));
  };

  const clearRutinasRealizadas = async () => {
    setRutinasRealizadas([]);
    await AsyncStorage.setItem('rutinasRealizadas', '[]');
  };

  const getRutinasJugadasDeJugador = (jugadorId: string) => {
    return rutinasRealizadas.filter((rutina) => {
      return rutina.jugadorID == jugadorId;
    });
  };

  return (
    <LocalStorageContext.Provider
      value={{
        jugadores,
        pushJugador,
        clearJugadoresDB,
        popJugador,
        updateJugador,
        findJugador,
        rutinas,
        popRutina,
        pushRutina,
        updateRutina,
        findRutina,
        clearRutinasDB,
        rutinasRealizadas,
        popRutinaRealizada,
        pushRutinaRealizada,
        clearRutinasRealizadas,
        getRutinasJugadasDeJugador,
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
