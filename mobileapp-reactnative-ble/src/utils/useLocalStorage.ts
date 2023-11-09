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
  popJugador: (jugadorNombre: string) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (jugadorName: string) => JugadorType | undefined;
  chargeAllJugadores: () => void;
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
  chargeAllRutinas: () => void;
  // Rutinas realizadas
  rutinasRealizadas: Array<ResultadoType>;
  pushRutinaRealizada: (newRutina: ResultadoType) => void;
  popRutinaRealizada: (rutinaId: string) => void;
  clearRutinasRealizadas: () => void;
  getRutinasJugadasDeJugador: (jugadorId: string) => Array<ResultadoType>;
}

function useLocalStorage(): LocalStorageType {
  const { isWifiConnected, token, getJugadores, getRutinas, saveRutina, saveJugador } =
    useCustomRemoteStorage();

  const [localJugadores, setLocalJugadores] = useState<Array<JugadorType>>([]);
  const [localRutinas, setLocalRutinas] = useState<Array<RutinaType>>([]);
  const [localRutinasRealizadas, setLocalRutinasRealizadas] = useState<Array<ResultadoType>>([]);

  const [AllJugadores, setAllJugadores] = useState<Array<JugadorType>>([]);
  const [AllRutinas, setAllRutinas] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    getLocalJugadores();
    getLocalRutinas();
    getLocalRutinasRealizadas();
  }, []);

  const pushAsyncRutinas = async (value: RutinaType) => {
    if (!localRutinas.some((r) => r.titulo === value.titulo)) {
      localRutinas.push(value);
      // si el localRutinas supera los 10 objetos elimina el primero

      if (localRutinas.length > 10) {
        localRutinas.shift();
      }

      // almacena en local el localRutinas
      console.log('stored');
      await AsyncStorage.setItem('rutinas', JSON.stringify(localRutinas));
    }
  };

  const pushAsyncJugadores = async (value: JugadorType) => {
    if (!localJugadores.some((jug) => jug.nombre === value.nombre)) {
      localJugadores.push(value);

      if (localJugadores.length > 10) {
        localJugadores.shift();
      }

      console.log('stored');
      await AsyncStorage.setItem('jugadores', JSON.stringify(localJugadores));
    }
  };

  // ****************************************** Jugadores ******************************************
  const getLocalJugadores = async () => {
    try {
      AsyncStorage.getItem('jugadores').then((value) => {
        if (value !== null) setLocalJugadores(JSON.parse(value));
      });
    } catch (e) {
      console.log(`listAllJugadores: ${e}`);
    }
  };

  const chargeAllJugadores = async () => {
    const storedJugadores: Array<JugadorType> = [];
    // si tiene wifi cargará en storedJugadores los jugadores en remoto
    if (isWifiConnected && token !== '') {
      const remoteJugadores = await getJugadores();
      if (remoteJugadores !== undefined && remoteJugadores.length > 0) {
        storedJugadores.push(...remoteJugadores);
      }
    }

    // toma los jugadores en local, comprueba si están en storedJugadores y si no lo están las guarda en notStoredLocalJugadores
    const notStoredLocalJugadores: Array<JugadorType> = localJugadores.filter(
      (jugLoc) => !storedJugadores.some((jugRem) => jugRem.nombre === jugLoc.nombre)
    );

    const allJugadores = [...storedJugadores, ...notStoredLocalJugadores];
    // cargará todos los jugadores, locales y remotos
    setAllJugadores(allJugadores);

    // almacenar las 10 ultimos jugadores remotos en local
    allJugadores.forEach((jugador) => pushAsyncJugadores(jugador));
  };

  const pushJugador = async (newJugador: JugadorType) => {
    const newJugadoresList = [...AllJugadores, newJugador];
    setAllJugadores(newJugadoresList);
    console.log(newJugador);

    if (isWifiConnected && token !== '') {
      const res = await saveJugador(newJugador);
      pushAsyncJugadores(res);
    } else {
      pushAsyncJugadores(newJugador);
    }
  };

  const popJugador = async (popJugadorNombre: string) => {
    // borra rutinas realizadas por jugador
    const rutinasDeJugador = getRutinasJugadasDeJugador(popJugadorNombre);
    rutinasDeJugador.forEach((rr) => popRutinaRealizada(rr._id));

    // borra jugador
    const newJugadoresList = AllJugadores.filter((j) => j.nombre !== popJugadorNombre);
    setAllJugadores(newJugadoresList);
    await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresList));
  };

  const updateJugador = async (newJugador: JugadorType) => {
    // busca en la lista de localJugadores el objeto modificado y lo actualiza
    const jugadorLocalIndex = localJugadores.findIndex((jugador) => jugador._id === newJugador._id);
    if (jugadorLocalIndex !== -1) {
      const newJugadoresLocal = [...localJugadores];
      newJugadoresLocal[jugadorLocalIndex] = newJugador;
      await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresLocal));
    }

    // busca en la lista de AllJugadores el objeto modificado y lo actualiza
    const allJugadoresIndex = AllJugadores.findIndex((jug) => jug.nombre === newJugador.nombre);
    if (allJugadoresIndex !== -1) {
      const newAllJugadores = [...AllJugadores];
      newAllJugadores[allJugadoresIndex] = newJugador;
      setAllJugadores(newAllJugadores);
    }
  };

  const findJugador = (jugadorName: string): JugadorType | undefined => {
    return localJugadores.find((jugador) => jugador.nombre == jugadorName);
  };

  const clearJugadoresDB = async () => {
    console.log('jugadores clear');
    setLocalJugadores([]);
    await AsyncStorage.setItem('jugadores', JSON.stringify([]));
  };

  // ****************************************** Rutinas ******************************************
  const getLocalRutinas = () => {
    AsyncStorage.getItem('rutinas').then((value) => {
      if (value !== null) {
        setLocalRutinas(JSON.parse(value));
      }
    });
  };

  const chargeAllRutinas = async () => {
    const storedRutinas: Array<RutinaType> = [];
    if (isWifiConnected && token !== '') {
      // si tiene wifi cargará en storedRutinas las rutinas en remoto
      const remoteRutinas = await getRutinas();
      if (remoteRutinas !== undefined && remoteRutinas.length > 0) {
        storedRutinas.push(...remoteRutinas);
      }
    }

    // toma las rutinas en local, comprueba si están en storedRutinas y si no lo están las guarda en notStoredLocalRutinas
    const notStoredLocalRutinas: Array<RutinaType> = localRutinas.filter(
      (rutLoc) => !storedRutinas.some((rutRem) => rutRem.titulo === rutLoc.titulo)
    );

    const allRutinas = [...notStoredLocalRutinas, ...storedRutinas];
    // cargará todas las rutinas, locales y remotas
    setAllRutinas(allRutinas);

    // almacenar las 10 ultimas rutinas remotas en local
    allRutinas.forEach((rutina) => pushAsyncRutinas(rutina));
  };

  const pushRutina = async (newRutina: RutinaType) => {
    const newRutinaList = [...AllRutinas, newRutina];
    setAllRutinas(newRutinaList);

    if (isWifiConnected && token !== '') {
      const res = await saveRutina(newRutina);
      pushAsyncRutinas(res);
    } else {
      // funcion que almacene unicamente 10 rutinas en local
      pushAsyncRutinas(newRutina);
    }
  };

  const popRutina = async (popRutinaTitulo: string) => {
    const newRutinaList = AllRutinas.filter((j) => j.titulo !== popRutinaTitulo);
    setAllRutinas(newRutinaList);
    await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinaList));
  };

  const updateRutina = async (newRutina: RutinaType) => {
    // busca en la lista de localRutinas el objeto modificado y lo actualiza
    const rutinaLocalIndex = localRutinas.findIndex((rutina) => rutina.titulo === newRutina.titulo);
    if (rutinaLocalIndex !== -1) {
      const newRutinasLocal = [...localRutinas];
      newRutinasLocal[rutinaLocalIndex] = newRutina;
      await AsyncStorage.setItem('rutinas', JSON.stringify(newRutinasLocal));
    }

    // busca en la lista de allRutinas el objeto modificado y lo actualiza
    const allRutinasIndex = AllRutinas.findIndex((rut) => rut.titulo === newRutina.titulo);
    if (allRutinasIndex !== -1) {
      const newAllRutinas = [...AllRutinas];
      newAllRutinas[allRutinasIndex] = newRutina;
      setAllRutinas(newAllRutinas);
    }
  };

  const clearRutinasDB = async () => {
    console.log('rutinas clear');
    setLocalJugadores([]);
    await AsyncStorage.setItem('rutinas', JSON.stringify([]));
  };

  const findRutina = (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ): RutinaType | undefined => {
    if (rutinaTitle !== undefined)
      return localRutinas.find((rutina) => rutina.titulo == rutinaTitle);
    if (rutinaId !== undefined) return localRutinas.find((rutina) => rutina._id == rutinaId);
    return undefined;
  };

  // ************************************ Rutinas Realizadas ************************************
  const getLocalRutinasRealizadas = async () => {
    AsyncStorage.getItem('rutinasRealizadas')
      .then((value) => {
        if (value !== null) setLocalRutinasRealizadas(JSON.parse(value));
      })
      .catch((error) => {
        console.log(`listAllRutinasRealizadas: ${error}`);
      });
  };

  const pushRutinaRealizada = async (newRutina: ResultadoType) => {
    setLocalRutinasRealizadas([...localRutinasRealizadas, newRutina]);
    await AsyncStorage.setItem(
      'rutinasRealizadas',
      JSON.stringify([...localRutinasRealizadas, newRutina])
    );
  };

  const popRutinaRealizada = async (popRutinaId: string) => {
    const newRutinaList = localRutinasRealizadas.filter((j) => j._id !== popRutinaId);
    setLocalRutinasRealizadas(newRutinaList);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify(newRutinaList));
  };

  const clearRutinasRealizadas = async () => {
    setLocalRutinasRealizadas([]);
    await AsyncStorage.setItem('rutinasRealizadas', JSON.stringify([]));
  };

  const getRutinasJugadasDeJugador = (jugadorNombre: string) => {
    return localRutinasRealizadas.filter((rutinaRealizada) => {
      return rutinaRealizada.nombre_jugador == jugadorNombre;
    });
  };

  return {
    jugadores: AllJugadores,
    pushJugador,
    clearJugadoresDB,
    popJugador,
    updateJugador,
    findJugador,
    chargeAllJugadores,
    rutinas: AllRutinas,
    popRutina,
    pushRutina,
    updateRutina,
    clearRutinasDB,
    findRutina,
    chargeAllRutinas,
    rutinasRealizadas: localRutinasRealizadas,
    popRutinaRealizada,
    pushRutinaRealizada,
    clearRutinasRealizadas,
    getRutinasJugadasDeJugador,
  };
}

export default useLocalStorage;
