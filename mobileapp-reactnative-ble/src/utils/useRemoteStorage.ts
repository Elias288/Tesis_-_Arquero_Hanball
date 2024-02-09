import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { JugadorType } from '../data/JugadoresType';
import { RutinaType } from '../data/RutinasType';
import fetchData from './fetchData';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  isApiUp: boolean;
  errorLogin: string;
  token: string;
  remoteUserId: string | undefined;

  isVisibleStorageAlert: boolean;
  storageAlertMsg: string;
  setIsVisibleStorageAlert: (value: boolean) => void;
  setStorageAlertMsg: (value: string) => void;

  login: (user: string, password: string) => void;
  setErrorLogin: (error: string) => void;
  clearUserData: () => void;
  // jugadores
  getJugadores: () => Promise<JugadorType[]>;
  saveJugador: (newJugador: JugadorType) => Promise<any>;
  deleteJugador: (jugadorMambuId: string) => Promise<any>;
  // rutinas
  getRutinas: () => Promise<RutinaType[]>;
  saveRutina: (newRutina: RutinaType) => Promise<any>;
  deleteRutina: (rutinaMambuId: string) => Promise<any>;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [isApiUp, setIsApiUp] = useState<boolean>(false);

  const [token, setToken] = useState<string>('');
  const [remoteUserId, setRemoteUserId] = useState<string | undefined>();

  const [isVisibleStorageAlert, setIsVisibleStorageAlert] = useState<boolean>(false);
  const [storageAlertMsg, setStorageAlertMsg] = useState<string>('');

  useEffect(() => {
    setErrorLogin('');

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected ?? false);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isWifiConnected) {
      setTimeout(() => {
        console.log('wifi connected');
        getUserData();
      }, 1000);
    } else {
      console.log('wifi disconnected');

      setIsApiUp(false);
    }
  }, [isWifiConnected]);

  const login = (usuario: string, contraseña: string) => {
    setErrorLogin('');
    setIsLoginLoading(true);

    const options = {
      method: 'POST',
      body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const callBackFunction = (result: any) => {
      if (result.res !== '0') {
        setIsLoginLoading(false);
        if (typeof result.message === 'string') setErrorLogin(result.message);
        return;
      }
      if (process.env.DEVELOP) {
        console.log('login result:');
        console.log(result.message);
      }
      setIsApiUp(true);
      const loggedToken = `Bearer ${result.message.token}`;

      setToken(loggedToken);
      storeUserData({ token: loggedToken, userId: result.message.userId });

      setIsLoginLoading(false);
    };
    const callBackErrorFunction = (err: any) => {
      if (err.name === 'AbortError') {
        setErrorLogin(
          `Es necesario estár conectado a wifi para iniciar sesión al menos una vez
          Si ya está conectado entonces no se ha podido conectar con la API, intente nuevamente más tarde`
        );
        setIsApiUp(false);
      }

      setIsLoginLoading(false);
      console.log('login catch:');
      console.log(err);
      setErrorLogin('error de logueo');
    };

    fetchData('usuario/login', options, callBackFunction, callBackErrorFunction, 20000);
  };

  // ****************************************** API ******************************************

  const getUserData = async () => {
    // hace un llamado a la api, si está responde con los datos del usuario quiere decir que la api está funcionando
    // si la api no reponde funciona con datos locales
    if (process.env.DEVELOP) console.log('geting user data');

    try {
      // carga el token si está guardado localmente
      const res = await AsyncStorage.getItem('userData');
      if (res !== null) {
        const userData = JSON.parse(res);
        if (process.env.DEVELOP) {
          console.log('userData:');
          console.log(userData);
        }

        setToken(userData.token);
        setRemoteUserId(userData.userId);

        // si tiene wifi intentará verificar que la api responda
        if (process.env.DEVELOP) console.log('verificando api');

        const options = {
          method: 'GET',
          headers: {
            Authorization: userData.token,
          },
        };
        const callBackFunction = (result: any) => {
          if (result.res !== '0') {
            console.log('details error');
            clearUserData();
          }

          if (process.env.DEVELOP) {
            console.log('details');
          }
          setIsApiUp(true);
        };
        const callBackErrorFunction = (err: any) => {
          if (err.name === 'AbortError') {
            setIsVisibleStorageAlert(true);
            setStorageAlertMsg(
              `No se pudo conectar a la API\nTodo lo almacenado en local se guardará en remoto al volver a conectarse`
            );
          }

          setIsApiUp(false);
          console.log(`getUserDataError: ${err}`);
          return;
        };
        fetchData(
          `usuario/details/${userData.userId}`,
          options,
          callBackFunction,
          callBackErrorFunction,
          10000
        );
      } else {
        if (process.env.DEVELOP) console.log('not logged');
      }
    } catch (error) {
      console.log(`getUserDataCatchError: ${error}`);
    }
  };

  const storeUserData = async (userData: { token: string; userId: string }) => {
    if (process.env.DEVELOP) {
      console.log('datauser stored:');
      console.log(userData);
    }

    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setRemoteUserId(userData.userId);
    setToken(userData.token);
  };

  const clearUserData = async () => {
    console.log('token clear');
    await AsyncStorage.setItem('userData', '');
    setToken('');
  };

  // ****************************************** Jugadores ******************************************

  const getJugadores = (): Promise<JugadorType[]> => {
    if (process.env.DEVELOP) console.log('getting jugadores of api');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);
      if (result.res !== '0') return [];
      console.log(result.message);
      return result.message;
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`getJugadoresError: ${err}`);
      return;
    };

    return fetchData(`usuario/JugadorList`, options, callBackFunction, callBackErrorFunction, 3000);
  };

  const saveJugador = (newJugador: JugadorType): Promise<any> => {
    if (process.env.DEVELOP) {
      console.log('stored Jugador: ');
      console.log(newJugador);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(newJugador),
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);
      if (result.res !== '0') return [];
      console.log(result.message);
      return result.message;
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`saveJugadorError: ${err}`);
      return;
    };

    return fetchData('jugador/add', options, callBackFunction, callBackErrorFunction, 3000);
  };

  const deleteJugador = (jugadorMambuId: string): Promise<any> => {
    if (process.env.DEVELOP) {
      console.log('delete Jugador: ');
      console.log(jugadorMambuId);
    }

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);
      if (result.res !== '0') return [];
      console.log(result.message);
      return result.message;
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`deleteJugadorError: ${err}`);
      return;
    };

    return fetchData(
      `jugador/delete/${jugadorMambuId}`,
      options,
      callBackFunction,
      callBackErrorFunction,
      3000
    );
  };

  // ****************************************** Rutinas ******************************************

  const getRutinas = (): Promise<RutinaType[]> => {
    if (process.env.DEVELOP) console.log('getting rutinas of api');

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);

      if (result.res !== '0') return [];

      return result.message.map((rutina: any) => {
        return { ...rutina, secuencias: JSON.parse(rutina.secuencias) };
      });
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`getRutinasError: ${err}`);
      return;
    };

    return fetchData('usuario/RutinaList', options, callBackFunction, callBackErrorFunction, 3000);
  };

  const saveRutina = (newRutina: RutinaType): Promise<any> => {
    if (process.env.DEVELOP) {
      console.log('stored Rutinas: ');
      console.log(newRutina);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ ...newRutina, secuencias: JSON.stringify(newRutina.secuencias) }),
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);

      if (result.res !== '0') {
        console.log(`saveRutinaError: ${result.message}`);
        return [];
      }

      return result.message;
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`saveRutinaError: ${err}`);
      return;
    };

    return fetchData('rutina/add', options, callBackFunction, callBackErrorFunction, 3000);
  };

  const deleteRutina = (rutinaMambuId: string): Promise<any> => {
    if (process.env.DEVELOP) {
      console.log('delete Jugador: ');
      console.log(rutinaMambuId);
    }

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    const callBackFunction = (result: any) => {
      setIsApiUp(true);
      if (result.res !== '0') return [];
      console.log(result.message);
      return result.message;
    };
    const callBackErrorFunction = (err: any) => {
      setIsApiUp(false);
      console.log(`deleteRutinaError: ${err}`);
      return;
    };

    return fetchData(
      `rutina/delete/${rutinaMambuId}`,
      options,
      callBackFunction,
      callBackErrorFunction,
      3000
    );
  };
  // ************************************* Rutinas Realizadas *************************************

  return {
    isWifiConnected,
    isLoginLoading,
    isApiUp,
    errorLogin,
    token,
    remoteUserId,
    isVisibleStorageAlert,
    storageAlertMsg,
    login,
    setErrorLogin,
    clearUserData,
    getJugadores,
    saveJugador,
    deleteJugador,
    getRutinas,
    saveRutina,
    deleteRutina,
    setIsVisibleStorageAlert,
    setStorageAlertMsg,
  };
}

export default useRemoteStorage;
