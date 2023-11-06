import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { JugadorType } from '../data/JugadoresType';
import { RutinaType } from '../data/RutinasType';
import { ResultadoType } from '../data/ResultadoType';
import { useCustomRemoteStorage } from '../contexts/RemoteStorageProvider';

export interface LocalStorageType {
  // Jugadores
  jugadores: Array<JugadorType>;
  pushJugador: (newJugador: JugadorType) => void;
  clearJugadoresDB: () => void;
  popJugador: (jugadorId: string) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (
    jugadorName: string | undefined,
    jugadorId: string | undefined
  ) => JugadorType | undefined;
  // Rutinas
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: string) => void;
  updateRutina: (newRutina: RutinaType) => void;
  clearRutinasDB: () => void;
  findRutina: (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ) => RutinaType | undefined;
  // Rutinas realizadas
  rutinasRealizadas: Array<ResultadoType>;
  pushRutinaRealizada: (newRutina: ResultadoType) => void;
  popRutinaRealizada: (rutinaId: string) => void;
  clearRutinasRealizadas: () => void;
  getRutinasJugadasDeJugador: (jugadorId: string) => Array<ResultadoType>;
}

function useLocalStorage(): LocalStorageType {
  const { isWifiConnected, token, getJugadores, getRutinas } = useCustomRemoteStorage();

  const [jugadores, setJugadores] = useState<Array<JugadorType>>([]);
  const [rutinas, setRutinas] = useState<Array<RutinaType>>([]);
  const [rutinasRealizadas, setRutinasRealizadas] = useState<Array<ResultadoType>>([]);

  useEffect(() => {
    listAllJugadores();
    ListAllRutinas();
    listAllRutinasRealizadas();
  }, [isWifiConnected, token]);

  // ****************************************** Jugadores ******************************************
  const listAllJugadores = async () => {
    // en caso de no estár conectado el wifi o no tener el token obtendrá los jugadores desde el almacenamiento
    // local, en caso contrario seteará los jugadores de la bd
    try {
      if (isWifiConnected && token !== '') {
        // si está conectado y logueado
        getJugadores().then((jugadores) => {
          // almacena los ultimos 10 jugadores de forma local
          const sortedJugadores = [...jugadores].sort((a, b) => {
            return new Date(b.fechaCreación).getTime() - new Date(a.fechaCreación).getTime();
          });

          setJugadores([]);
          sortedJugadores.slice(0, 10).forEach(pushJugador);
        });
      }

      // si no está conectado
      AsyncStorage.getItem('jugadores').then((value) => {
        if (value !== null) setJugadores(JSON.parse(value));
      });
    } catch (e) {
      console.log(e);
    }
  };

  const pushJugador = async (newJugador: JugadorType) => {
    if (!jugadores.some((jugador) => jugador._id === newJugador._id)) {
      setJugadores([...jugadores, newJugador]);
      await AsyncStorage.setItem('jugadores', JSON.stringify([...jugadores, newJugador]));
    }
  };

  const popJugador = async (popJugadorId: string) => {
    // borra rutinas realizadas por jugador
    const rutinasDeJugador = getRutinasJugadasDeJugador(popJugadorId);
    rutinasDeJugador.forEach((rr) => popRutinaRealizada(rr._id));

    // borra jugador
    const newJugadoresList = jugadores.filter((j) => j._id !== popJugadorId);
    setJugadores(newJugadoresList);
    await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresList));
  };

  const updateJugador = async (newJugador: JugadorType) => {
    const jugadorIndex = jugadores.findIndex((jugador) => jugador._id === newJugador._id);

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
    if (jugadorName != undefined) return jugadores.find((jugador) => jugador.nombre == jugadorName);
    if (jugadorId != undefined) return jugadores.find((jugador) => jugador._id == jugadorId);
    return undefined;
  };

  const clearJugadoresDB = async () => {
    console.log('jugadores clear');
    setJugadores([]);
    await AsyncStorage.setItem('jugadores', JSON.stringify([]));
  };

  // ****************************************** Rutinas ******************************************
  const ListAllRutinas = async () => {
    // en caso de no estár conectado el wifi o no tener el token obtendrá las rutinas desde el almacenamiento
    // local, en caso contrario seteará las rutinas de la bd
    try {
      if (isWifiConnected && token !== '') {
        // si está conectado y logueado
        getRutinas().then((rutinas) => {
          // almacena los ultimos 10 jugadores de forma local
          const sorted = [...rutinas].sort((a, b) => {
            return new Date(b.fechaDeCreación).getTime() - new Date(a.fechaDeCreación).getTime();
          });

          setRutinas([]);
          sorted.slice(0, 10).forEach(pushRutina);
        });
      }

      // si no está conectado
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
    const newRutinaList = rutinas.filter((j) => j._id !== popRutinaId);
    setRutinas(newRutinaList);
    await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinaList));
  };

  const updateRutina = async (newRutina: RutinaType) => {
    const rutinaIndex = rutinas.findIndex((rutina) => rutina._id === newRutina._id);

    if (rutinaIndex !== -1) {
      const newRutinas = [...rutinas];
      newRutinas[rutinaIndex] = newRutina;
      setRutinas(newRutinas);
      await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinas));
    }
  };

  const clearRutinasDB = async () => {
    console.log('rutinas clear');
    setJugadores([]);
    await AsyncStorage.setItem('rutinas', JSON.stringify([]));
  };

  const findRutina = (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ): RutinaType | undefined => {
    if (rutinaTitle !== undefined) return rutinas.find((rutina) => rutina.titulo == rutinaTitle);
    if (rutinaId !== undefined) return rutinas.find((rutina) => rutina._id == rutinaId);
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

  const pushRutinaRealizada = async (newRutina: ResultadoType) => {
    setRutinasRealizadas([...rutinasRealizadas, newRutina]);
    await AsyncStorage.setItem(
      'rutinasRealizadas',
      JSON.stringify([...rutinasRealizadas, newRutina])
    );
  };

  const popRutinaRealizada = async (popRutinaId: string) => {
    const newRutinaList = rutinasRealizadas.filter((j) => j._id !== popRutinaId);
    setRutinasRealizadas(newRutinaList);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify(newRutinaList));
  };

  const clearRutinasRealizadas = async () => {
    setRutinasRealizadas([]);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify([]));
  };

  const getRutinasJugadasDeJugador = (jugadorId: string) => {
    return rutinasRealizadas.filter((rutinaRealizada) => {
      return rutinaRealizada.id_jugador == jugadorId;
    });
  };

  return {
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
    clearRutinasDB,
    findRutina,
    rutinasRealizadas,
    popRutinaRealizada,
    pushRutinaRealizada,
    clearRutinasRealizadas,
    getRutinasJugadasDeJugador,
  };
}

export default useLocalStorage;
