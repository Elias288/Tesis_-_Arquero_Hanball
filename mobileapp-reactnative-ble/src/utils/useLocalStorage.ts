import { useEffect, useState } from 'react';
import { JugadorType } from '../data/JugadoresType';
import { RutinaType } from '../data/RutinasType';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalStorageType {
  localToken: string;
  saveToken: (token: string) => void;
  clearToken: () => void;
  jugadores: Array<JugadorType>;
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (jugadorId: number) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (
    jugadorName: string | undefined,
    jugadorId: number | undefined
  ) => JugadorType | undefined;
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: number) => void;
  findRutina: (
    rutinaTitle: string | undefined,
    rutinaId: number | undefined
  ) => RutinaType | undefined;
  rutinasRealizadas: Array<RutinaType>;
  pushRutinaRealizada: (newRutina: RutinaType) => void;
  popRutinaRealizada: (rutinaId: number) => void;
  clearRutinasRealizadas: () => void;
  getRutinasJugadasDeJugador: (jugadorId: number) => Array<RutinaType>;
}

function useLocalStorage(): LocalStorageType {
  const [jugadores, setJugadores] = useState<Array<JugadorType>>([]);
  const [rutinas, setRutinas] = useState<Array<RutinaType>>([]);
  const [rutinasRealizadas, setRutinasRealizadas] = useState<Array<RutinaType>>([]);
  const [localToken, setLocalToken] = useState<string>('');

  useEffect(() => {
    listAllJugadores();
    ListAllRutinas();
    listAllRutinasRealizadas();
    getToken();
  }, []);

  // ****************************************** Token ******************************************

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) setLocalToken(value);
    } catch (error) {
      console.log(error);
    }
  };

  const saveToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setLocalToken(token);
  };

  const clearToken = async () => {
    await AsyncStorage.setItem('token', '');
    setLocalToken('');
  };

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

  const popJugador = async (popJugadorId: number) => {
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
    jugadorId: number | undefined
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

  const popRutina = async (popRutinaId: number) => {
    const newRutinaList = rutinas.filter((j) => j.id !== popRutinaId);
    setRutinas(newRutinaList);
    await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinaList));
  };

  const findRutina = (
    rutinaTitle: string | undefined,
    rutinaId: number | undefined
  ): RutinaType | undefined => {
    if (rutinaTitle !== undefined) return rutinas.find((rutina) => rutina.title == rutinaTitle);
    if (rutinaId !== undefined) return rutinas.find((rutina) => rutina.id == rutinaId);
    return undefined;
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

  const popRutinaRealizada = async (popRutinaId: number) => {
    const newRutinaList = rutinasRealizadas.filter((j) => j.id !== popRutinaId);
    setRutinasRealizadas(newRutinaList);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify(newRutinaList));
  };

  const clearRutinasRealizadas = async () => {
    setRutinasRealizadas([]);
    await AsyncStorage.setItem('rutinasRealizadas', '[]');
  };

  const getRutinasJugadasDeJugador = (jugadorId: number) => {
    return rutinasRealizadas.filter((rutina) => {
      return rutina.jugadorID == jugadorId;
    });
  };

  return {
    localToken,
    saveToken,
    clearToken,
    jugadores,
    pushJugador,
    clearJugadoresDB,
    popJugador,
    updateJugador,
    findJugador,
    rutinas,
    popRutina,
    pushRutina,
    findRutina,
    rutinasRealizadas,
    popRutinaRealizada,
    pushRutinaRealizada,
    clearRutinasRealizadas,
    getRutinasJugadasDeJugador,
  };
}

export default useLocalStorage;
