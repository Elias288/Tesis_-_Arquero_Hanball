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
  popJugador: (jugadorNombre: string) => void;
  updateJugador: (newJugador: JugadorType) => void;
  findJugador: (jugadorName: string) => JugadorType | undefined;
  chargeAllJugadores: () => void;
  // Rutinas
  rutinas: Array<RutinaType>;
  pushRutina: (newRutina: RutinaType) => void;
  popRutina: (rutinaId: string) => void;
  updateRutina: (newRutina: RutinaType) => void;
  findRutina: (
    rutinaTitle: string | undefined,
    rutinaId: string | undefined
  ) => RutinaType | undefined;
  chargeAllRutinas: () => void;
  // Rutinas realizadas
  rutinasRealizadas: Array<ResultadoType>;
  pushRutinaRealizada: (newRutina: ResultadoType) => void;
  popRutinaRealizada: (rutinaId: string) => void;
  getRutinasJugadasDeJugador: (jugadorId: string) => Array<ResultadoType>;
}

const AsynStorageItems = {
  rutinas: 'rutinas',
  rutinasRealizadas: 'rutinasRealizadas',
  jugadores: 'jugadores',
  deletedJugadores: 'deletedJugadores',
  deletedRutinas: 'deletedRutinas',
};

function useLocalStorage(): LocalStorageType {
  const {
    isApiUp,
    getJugadores,
    getRutinas,
    saveRutina,
    saveJugador,
    clearUserData,
    setIsVisibleStorageAlert,
    setStorageAlertMsg,
    deleteJugador,
    deleteRutina,
  } = useCustomRemoteStorage();

  const [localJugadores, setLocalJugadores] = useState<Array<JugadorType>>([]);
  const [localRutinas, setLocalRutinas] = useState<Array<RutinaType>>([]);
  const [localRutinasRealizadas, setLocalRutinasRealizadas] = useState<Array<ResultadoType>>([]);

  const [AllJugadores, setAllJugadores] = useState<Array<JugadorType>>([]);
  const [AllRutinas, setAllRutinas] = useState<Array<RutinaType>>([]);

  const [deletedJugadoresMambuIds, setDeletedJugadoresMambuIds] = useState<Array<string>>([]);
  const [deletedRutinasMambuIds, setDeletedRutinasMambuIds] = useState<Array<string>>([]);

  useEffect(() => {
    // clearJugadoresDB();
    // clearRutinasDB();
    // clearUserData();
    // clearRutinasRealizadas();

    getLocalJugadores();
    getDeletedJugadores();
    getLocalRutinas();
    getDeletedRutinas();
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
      if (process.env.DEVELOP) console.log('store: ' + value.titulo);
      await AsyncStorage.setItem(AsynStorageItems.rutinas, JSON.stringify(localRutinas));
    }
  };

  const pushAsyncJugadores = async (value: JugadorType) => {
    if (!localJugadores.some((jug) => jug.nombre === value.nombre)) {
      localJugadores.push(value);

      // si el localRutinas supera los 10 objetos elimina el primero
      if (localJugadores.length > 10) {
        localJugadores.shift();
      }

      // almacena en local el localRutinas
      if (process.env.DEVELOP) console.log('store: ' + value.nombre);
      await AsyncStorage.setItem(AsynStorageItems.jugadores, JSON.stringify(localJugadores));
    }
  };

  // ****************************************** Jugadores ******************************************
  const getLocalJugadores = () => {
    try {
      AsyncStorage.getItem(AsynStorageItems.jugadores).then((value) => {
        if (value !== null) setLocalJugadores(JSON.parse(value));
      });
    } catch (e) {
      console.log(`listAllJugadores: ${e}`);
    }
  };

  const getDeletedJugadores = () => {
    try {
      AsyncStorage.getItem(AsynStorageItems.deletedJugadores).then((val) => {
        if (val !== null) {
          setDeletedJugadoresMambuIds(JSON.parse(val));
          console.log('gettingDeletedJugadores');
          console.log(JSON.parse(val));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getDeletedRutinas = () => {
    try {
      AsyncStorage.getItem(AsynStorageItems.deletedRutinas).then((val) => {
        if (val !== null) {
          setDeletedRutinasMambuIds(JSON.parse(val));
          console.log('gettingDeletedRutinas');
          console.log(JSON.parse(val));
        }
      });
    } catch (error) {}
  };

  const chargeAllJugadores = async () => {
    if (process.env.DEVELOP) console.log('chargin jugadores');

    const storedJugadores: Array<JugadorType> = [];
    // si tiene wifi cargará en storedJugadores los jugadores en remoto
    if (isApiUp) {
      if (process.env.DEVELOP) console.log('is api up');
      const remoteJugadores = await getJugadores();
      if (remoteJugadores !== undefined && remoteJugadores.length > 0) {
        if (process.env.DEVELOP) {
          console.log('deleted jugadores:');
          console.log(deletedJugadoresMambuIds);
        }

        // filtra los jugadores remotos, sacando los que se hayan eliminado
        const remJug = remoteJugadores.filter(
          (j) => !deletedJugadoresMambuIds.some((djID) => djID === j._id)
        );
        if (process.env.DEVELOP) {
          console.log('remotedJugadores:');
          console.log(remJug);
        }

        storedJugadores.push(...remJug);
      }
    }

    // toma los jugadores en local, comprueba si están en storedJugadores y si no lo están las guarda en notStoredLocalJugadores
    const notStoredLocalJugadores: Array<JugadorType> = localJugadores.filter(
      (jugLoc) => !storedJugadores.some((jugRem) => jugRem.nombre === jugLoc.nombre)
    );

    if (process.env.DEVELOP) {
      console.log('localJugadores:');
      console.log(localJugadores.map((j) => j.nombre));
      console.log('notstoredJugadores:');
      console.log(notStoredLocalJugadores.map((j) => j.nombre));
    }
    if (isApiUp) {
      // enviar a la api los jugadores no guardados
      notStoredLocalJugadores.forEach(saveJugador);

      // eliminar los jugadores que estén en eliminados
      deletedJugadoresMambuIds.forEach(deleteJugador);
      setDeletedJugadoresMambuIds([]);
      AsyncStorage.setItem(AsynStorageItems.deletedJugadores, '[]');

      setIsVisibleStorageAlert(true);
      setStorageAlertMsg('Jugador sincrinizados');
    }

    const allJugadores = [...storedJugadores, ...notStoredLocalJugadores];

    if (process.env.DEVELOP) {
      console.log('allJugadores:');
      console.log(allJugadores.map((j) => j.nombre));
    }
    // cargará todos los jugadores, locales y remotos
    setAllJugadores(allJugadores);

    // almacenar las 10 ultimos jugadores remotos en local
    allJugadores.forEach((jugador) => pushAsyncJugadores(jugador));
  };

  const pushJugador = async (newJugador: JugadorType) => {
    const newJugadoresList = [...AllJugadores, newJugador];
    if (process.env.DEVELOP) {
      console.log('push jugador:');
      console.log(newJugador);
    }

    setAllJugadores(newJugadoresList);

    if (isApiUp) {
      const res = await saveJugador(newJugador);
      console.log(res);
      pushAsyncJugadores(res);
      setIsVisibleStorageAlert(true);
      setStorageAlertMsg('El jugador se a agregado en local y remoto');
    } else {
      pushAsyncJugadores(newJugador);
      setIsVisibleStorageAlert(true);
      setStorageAlertMsg(
        'El jugador se a agregado al almacenamiento local, conecte a internet para sincrionizar'
      );
    }
  };

  const popJugador = async (popJugadorNombre: string) => {
    // borra rutinas realizadas por jugador
    const rutinasDeJugador = getRutinasJugadasDeJugador(popJugadorNombre);
    rutinasDeJugador.forEach((rr) => popRutinaRealizada(rr._id));

    // borra jugador local
    const newJugadoresList = AllJugadores.filter((j) => j.nombre !== popJugadorNombre);
    const jugadorToDelete = findJugador(popJugadorNombre);
    if (process.env.DEVELOP) {
      console.log('newJugadoresList:');
      console.log(newJugadoresList);
    }

    setAllJugadores(newJugadoresList);
    setLocalJugadores((jugadores) => jugadores.filter((j) => j.nombre !== popJugadorNombre));
    await AsyncStorage.setItem(AsynStorageItems.jugadores, JSON.stringify(newJugadoresList));

    // si la api está conectada y el jugador estaba guardado remotamente
    if (jugadorToDelete?._id) {
      if (isApiUp) {
        const res = await deleteJugador(jugadorToDelete._id);
        setIsVisibleStorageAlert(true);
        setStorageAlertMsg('Jugador eliminado de local y remoto');
        if (process.env.DEVELOP) console.log(res);
      } else {
        // si la api no está conectada
        const deletedJugadores = [...deletedJugadoresMambuIds, jugadorToDelete._id];
        setDeletedJugadoresMambuIds(deletedJugadores);
        await AsyncStorage.setItem(
          AsynStorageItems.deletedJugadores,
          JSON.stringify(deletedJugadores)
        );
        setIsVisibleStorageAlert(true);
        setStorageAlertMsg(
          'Jugador eliminado de almacenamiento local, conecte a internet para sincrionizar'
        );
        if (process.env.DEVELOP) console.log('deletedJugadorLocal: ' + jugadorToDelete._id);
      }
    }
  };

  const updateJugador = async (newJugador: JugadorType) => {
    // busca en la lista de localJugadores el objeto modificado y lo actualiza
    const jugadorLocalIndex = localJugadores.findIndex((jugador) => jugador._id === newJugador._id);
    if (jugadorLocalIndex !== -1) {
      const newJugadoresLocal = [...localJugadores];
      newJugadoresLocal[jugadorLocalIndex] = newJugador;
      await AsyncStorage.setItem(AsynStorageItems.jugadores, JSON.stringify(newJugadoresLocal));
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
    const jugadorByNombre = localJugadores.find((jugador) => jugador.nombre == jugadorName);
    return jugadorByNombre;
  };

  const clearJugadoresDB = async () => {
    console.log('jugadores clear');
    setLocalJugadores([]);
    await AsyncStorage.setItem(AsynStorageItems.jugadores, JSON.stringify([]));
  };

  // ****************************************** Rutinas ******************************************
  const getLocalRutinas = () => {
    AsyncStorage.getItem(AsynStorageItems.rutinas).then((value) => {
      if (value !== null) {
        setLocalRutinas(JSON.parse(value));
      }
    });
  };

  const chargeAllRutinas = async () => {
    if (process.env.DEVELOP) console.log('chargin rutinas');

    const storedRutinas: Array<RutinaType> = [];
    // si tiene wifi cargará en storedRutinas las rutinas en remoto
    if (isApiUp) {
      if (process.env.DEVELOP) console.log('is api up');
      const remoteRutinas = await getRutinas();
      if (remoteRutinas !== undefined && remoteRutinas.length > 0) {
        if (process.env.DEVELOP) {
          console.log('deleted rutinas:');
          console.log(deletedRutinasMambuIds);
        }

        // filtra las rutinas remotas, sacando los que se hayan eliminado
        const remRut = remoteRutinas.filter(
          (rr) => !deletedRutinasMambuIds.some((drID) => drID === rr._id)
        );
        if (process.env.DEVELOP) {
          console.log('remotedRutians:');
          console.log(remRut);
        }

        storedRutinas.push(...remRut);
      }
    }

    // toma las rutinas en local, comprueba si están en storedRutinas y si no lo están las guarda en notStoredLocalRutinas
    const notStoredLocalRutinas: Array<RutinaType> = localRutinas.filter(
      (rutLoc) => !storedRutinas.some((rutRem) => rutRem.titulo === rutLoc.titulo)
    );

    if (process.env.DEVELOP) {
      console.log('localRutinas:');
      console.log(localRutinas.map((j) => j.titulo));
      console.log('notStoredLocalRutinas:');
      console.log(notStoredLocalRutinas.map((j) => j.titulo));
    }

    // enviar a la api los jugadores no guardados
    if (isApiUp) {
      notStoredLocalRutinas.forEach(saveRutina);

      // eliminar las rutinas que estén en eliminados
      deletedRutinasMambuIds.forEach(deleteRutina);
      setDeletedRutinasMambuIds([]);
      AsyncStorage.setItem(AsynStorageItems.deletedRutinas, '[]');

      setIsVisibleStorageAlert(true);
      setStorageAlertMsg('Rutinas sincronizadas');
    }

    const allRutinas = [...notStoredLocalRutinas, ...storedRutinas];

    if (process.env.DEVELOP) {
      console.log('allRutinas:');
      console.log(allRutinas.map((j) => j.titulo));
    }

    // cargará todas las rutinas, locales y remotas
    setAllRutinas(allRutinas);

    // almacenar las 10 ultimas rutinas remotas en local
    allRutinas.forEach((rutina) => pushAsyncRutinas(rutina));
  };

  const pushRutina = async (newRutina: RutinaType) => {
    const newRutinaList = [...AllRutinas, newRutina];
    setAllRutinas(newRutinaList);

    if (isApiUp) {
      const res = await saveRutina(newRutina);
      pushAsyncRutinas(res);
      setStorageAlertMsg('La rutina se a agregado en local y remoto');
      setIsVisibleStorageAlert(true);
    } else {
      // funcion que almacene unicamente 10 rutinas en local
      pushAsyncRutinas(newRutina);
      setStorageAlertMsg(
        'La rutina se a agregado al almacenamiento local, conecte a internet para sincrionizar'
      );
      setIsVisibleStorageAlert(true);
    }
  };

  const popRutina = async (popRutinaTitulo: string) => {
    const newRutinaList = AllRutinas.filter((j) => j.titulo != popRutinaTitulo);
    const rutinaToDelete = findRutina(popRutinaTitulo, undefined);
    if (process.env.DEVELOP) {
      console.log('newRutinaList:');
      console.log(newRutinaList);
    }

    setAllRutinas(newRutinaList);
    setLocalRutinas((rutinas) => rutinas.filter((r) => r.titulo !== popRutinaTitulo));
    await AsyncStorage.setItem(AsynStorageItems.rutinas, JSON.stringify(newRutinaList));

    if (rutinaToDelete?._id) {
      if (isApiUp) {
        const res = await deleteRutina(rutinaToDelete._id);
        if (process.env.DEVELOP) console.log(res);
        setIsVisibleStorageAlert(true);
        setStorageAlertMsg('Rutina eliminada de local y remoto');
      } else {
        const deletedRutinas = [...deletedRutinasMambuIds, rutinaToDelete._id];
        setDeletedRutinasMambuIds(deletedRutinas);
        await AsyncStorage.setItem(AsynStorageItems.deletedRutinas, JSON.stringify(deletedRutinas));
        if (process.env.DEVELOP) console.log('deletedRutinaLocal: ' + rutinaToDelete._id);

        setIsVisibleStorageAlert(true);
        setStorageAlertMsg(
          'Rutina eliminada de almacenamiento local, conecte a internet para sincrionizar'
        );
      }
    }
  };

  const updateRutina = async (newRutina: RutinaType) => {
    // busca en la lista de localRutinas el objeto modificado y lo actualiza
    const rutinaLocalIndex = localRutinas.findIndex((rutina) => rutina.titulo === newRutina.titulo);
    if (rutinaLocalIndex !== -1) {
      const newRutinasLocal = [...localRutinas];
      newRutinasLocal[rutinaLocalIndex] = newRutina;
      await AsyncStorage.setItem(AsynStorageItems.rutinas, JSON.stringify(newRutinasLocal));
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
    await AsyncStorage.setItem(AsynStorageItems.rutinas, JSON.stringify([]));
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
    AsyncStorage.getItem(AsynStorageItems.rutinasRealizadas)
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
      AsynStorageItems.rutinasRealizadas,
      JSON.stringify([...localRutinasRealizadas, newRutina])
    );
  };

  const popRutinaRealizada = async (popRutinaId: string) => {
    const newRutinaList = localRutinasRealizadas.filter((j) => j._id !== popRutinaId);
    setLocalRutinasRealizadas(newRutinaList);
    await AsyncStorage.setItem(AsynStorageItems.rutinasRealizadas, JSON.stringify(newRutinaList));
  };

  const clearRutinasRealizadas = async () => {
    setLocalRutinasRealizadas([]);
    await AsyncStorage.setItem(AsynStorageItems.rutinasRealizadas, JSON.stringify([]));
  };

  const getRutinasJugadasDeJugador = (jugadorNombre: string) => {
    return localRutinasRealizadas.filter((rutinaRealizada) => {
      return rutinaRealizada.nombre_jugador == jugadorNombre;
    });
  };

  return {
    jugadores: AllJugadores,
    pushJugador,
    popJugador,
    updateJugador,
    findJugador,
    chargeAllJugadores,
    rutinas: AllRutinas,
    popRutina,
    pushRutina,
    updateRutina,
    findRutina,
    chargeAllRutinas,
    rutinasRealizadas: localRutinasRealizadas,
    popRutinaRealizada,
    pushRutinaRealizada,
    getRutinasJugadasDeJugador,
  };
}

export default useLocalStorage;
