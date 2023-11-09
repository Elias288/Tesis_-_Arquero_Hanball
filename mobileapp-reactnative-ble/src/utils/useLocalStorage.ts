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
  const { isWifiConnected, token, getJugadores, getRutinas, saveRutina } = useCustomRemoteStorage();

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

  const getAsyncStore = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  const pushAsyncStore = async (key: string, value: any, array: Array<any>) => {
    // agregar el nuevo objeto al array pasado
    // array = localJugadores / localRutinas / localRutinasRealizadas
    if (!array.some((r) => r.titulo === value.titulo)) {
      array.push(value);
      // si el array supera los 10 objetos elimina el primero

      if (array.length > 10) {
        array.shift();
      }

      // almacena en local el array
      console.log('stored');
      await AsyncStorage.setItem(key, JSON.stringify(array));
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
    const notStoredLocalJugadores = localJugadores.filter(
      (jugLoc) => !localJugadores.some((jugRem) => jugRem.nombre === jugLoc.nombre)
    );

    const allJugadores = [...storedJugadores, ...notStoredLocalJugadores];
    // cargará todos los jugadores, locales y remotos
    setAllJugadores(allJugadores);

    // almacenar las 10 ultimos jugadores remotos en local
    allJugadores.forEach((jugador) => pushAsyncStore('jugadores', jugador, localJugadores));
  };

  const pushJugador = async (newJugador: JugadorType) => {
    if (!localJugadores.some((jugador) => jugador._id === newJugador._id)) {
      setLocalJugadores([...localJugadores, newJugador]);
      await AsyncStorage.setItem('jugadores', JSON.stringify([...localJugadores, newJugador]));
    }
  };

  const popJugador = async (popJugadorId: string) => {
    // borra rutinas realizadas por jugador
    const rutinasDeJugador = getRutinasJugadasDeJugador(popJugadorId);
    rutinasDeJugador.forEach((rr) => popRutinaRealizada(rr._id));

    // borra jugador
    const newJugadoresList = localJugadores.filter((j) => j._id !== popJugadorId);
    setLocalJugadores(newJugadoresList);
    await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadoresList));
  };

  const updateJugador = async (newJugador: JugadorType) => {
    const jugadorIndex = localJugadores.findIndex((jugador) => jugador._id === newJugador._id);

    if (jugadorIndex !== -1) {
      const newJugadores = [...localJugadores];
      newJugadores[jugadorIndex] = newJugador;
      setLocalJugadores(newJugadores);
      await AsyncStorage.setItem('jugadores', JSON.stringify(newJugadores));
    }
  };

  const findJugador = (
    jugadorName: string | undefined,
    jugadorId: string | undefined
  ): JugadorType | undefined => {
    if (jugadorName != undefined)
      return localJugadores.find((jugador) => jugador.nombre == jugadorName);
    if (jugadorId != undefined) return localJugadores.find((jugador) => jugador._id == jugadorId);
    return undefined;
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
    allRutinas.forEach((rutina) => pushAsyncStore('rutinas', rutina, localRutinas));
  };

  const pushRutina = (newRutina: RutinaType) => {
    const newRutinaList = [...AllRutinas, newRutina];
    setAllRutinas(newRutinaList);

    // funcion que almacene unicamente 10 rutinas en local
    pushAsyncStore('rutinas', newRutina, localRutinas);
  };

  const popRutina = async (popRutinaTitulo: string) => {
    const newRutinaList = AllRutinas.filter((j) => j.titulo !== popRutinaTitulo);
    setAllRutinas(newRutinaList);
    console.log(popRutinaTitulo);

    console.log(JSON.stringify(newRutinaList, null, 4));

    getAsyncStore('rutinas', newRutinaList);
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

  const getRutinasJugadasDeJugador = (jugadorId: string) => {
    return localRutinasRealizadas.filter((rutinaRealizada) => {
      return rutinaRealizada.id_jugador == jugadorId;
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
