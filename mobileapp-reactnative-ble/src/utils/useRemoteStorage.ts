import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL, DEVELOP } from '@env';
import { JugadorType } from '../data/JugadoresType';
import { APIResType } from '../data/APIResType';
import { RutinaType } from '../data/RutinasType';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  isApiUp: boolean;
  errorLogin: string;
  token: string;
  remoteUserId: string | undefined;

  login: (user: string, password: string) => void;
  setErrorLogin: (error: string) => void;
  clearUserData: () => void;
  // jugadores
  getJugadores: () => Promise<JugadorType[]>;
  saveJugador: (newJugador: JugadorType) => Promise<any>;
  // rutinas
  getRutinas: () => Promise<RutinaType[]>;
  saveRutina: (newRutina: RutinaType) => Promise<any>;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [isApiUp, setIsApiUp] = useState<boolean>(false);

  const [token, setToken] = useState<string>('');
  const [remoteUserId, setRemoteUserId] = useState<string | undefined>();

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
    getUserData();
  }, [isWifiConnected]);

  const login = (usuario: string, contraseña: string) => {
    setErrorLogin('');
    setIsLoginLoading(true);

    const controller = new AbortController();

    const time = setTimeout(() => {
      // si el tiempo se agota y no se pudo conectar con la API se mostrará el mensaje de error
      setErrorLogin('Es necesario estár conectado a wifi para iniciar sesión al menos una vez');
      controller.abort();
    }, 10000);

    const options = {
      method: 'POST',
      body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    fetch(`${API_URL}/api/usuario/login`, options)
      .then((res) => res.json())
      .then((result: any) => {
        clearTimeout(time);
        setIsApiUp(true);
        if (result.res !== '0') {
          setIsLoginLoading(false);
          if (typeof result.message === 'string') setErrorLogin(result.message);
          return;
        }
        if (DEVELOP) {
          console.log('login result:');
          console.log(result.message);
        }

        const loggedToken = `Bearer ${result.message.token}`;

        setToken(loggedToken);
        storeUserData({ token: loggedToken, userId: result.message.userId });

        setIsLoginLoading(false);
      })
      .catch((err) => {
        setIsLoginLoading(false);
        console.log(err);
      });
  };

  // ****************************************** API ******************************************

  const getUserData = async () => {
    // hace un llamado a la api, si está responde con los datos del usuario quiere decir que la api está funcionando
    // si la api no reponde funciona con datos locales
    if (DEVELOP) console.log('geting user data');

    try {
      // carga el token si está guardado localmente
      const res = await AsyncStorage.getItem('userData');
      if (res !== null) {
        const userData = JSON.parse(res);
        if (DEVELOP) {
          console.log('userData:');
          console.log(userData);
        }

        setToken(userData.token);
        setRemoteUserId(userData.userId);

        // si tiene wifi intentará verificar que la api responda
        if (isWifiConnected) {
          if (DEVELOP) console.log('verificando api');

          const controller = new AbortController();
          const time = setTimeout(() => controller.abort(), 3000);
          const options = {
            method: 'GET',
            headers: {
              Authorization: userData.token,
            },
            signal: controller.signal,
          };

          fetch(`${API_URL}/api/usuario/details/${userData.userId}`, options)
            .then((res) => res.json())
            .then((result: any) => {
              clearTimeout(time);
              if (result.res !== '0') {
                console.log('details error');
                clearUserData();
              }

              if (DEVELOP) {
                console.log('details');
              }
              setIsApiUp(true);
            })
            .catch((err) => {
              setIsApiUp(false);
              console.log(`usuarioDetailsError: ${err}`);
              return;
            });
        }
      } else {
        if (DEVELOP) console.log('not logged');
      }
    } catch (error) {
      console.log(`getUserDataError: ${error}`);
    }
  };

  const storeUserData = async (userData: { token: string; userId: string }) => {
    if (DEVELOP) {
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
    if (DEVELOP) console.log('getting jugadores of api: ');

    const controller = new AbortController();
    const time = setTimeout(() => {
      controller.abort();
      // si el tiempo se agota, la api se marca como desconectada
      setIsApiUp(false);
    }, 3000);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      signal: controller.signal,
    };

    return fetch(`${API_URL}/api/usuario/JugadorList`, options)
      .then((res) => res.json())
      .then((result) => {
        clearTimeout(time);

        if (result.res !== '0') return [];

        return result.message;
      })
      .catch((err) => {
        clearTimeout(time);
        console.log(`getJugadoresErr: ${JSON.stringify(err)}`);
      });
  };

  const saveJugador = (newJugador: JugadorType): Promise<any> => {
    if (DEVELOP) {
      console.log('stored Jugador: ');
      console.log(newJugador);
    }

    const controller = new AbortController();
    const time = setTimeout(() => {
      controller.abort();
      // si el tiempo se agota, la api se marca como desconectada
      setIsApiUp(false);
    }, 3000);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      signal: controller.signal,
      body: JSON.stringify(newJugador),
    };

    return fetch(`${API_URL}/api/jugador/add`, options)
      .then((res) => res.json())
      .then((result) => {
        clearTimeout(time);

        if (result.res !== '0') {
          console.log(`saveJugadorError: ${JSON.stringify(result.message)}`);
          return [];
        }

        return result.message;
      })
      .catch((err) => {
        clearTimeout(time);
        console.log(`saveJugadorError: ${err}`);
      });
  };

  // ****************************************** Rutinas ******************************************

  const getRutinas = (): Promise<RutinaType[]> => {
    const controller = new AbortController();

    const time = setTimeout(() => controller.abort(), 3000);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      signal: controller.signal,
    };

    return fetch(`${API_URL}/api/usuario/RutinaList`, options)
      .then((res) => res.json())
      .then((result) => {
        clearTimeout(time);

        if (result.res !== '0') {
          return [];
        }

        return result.message.map((rutina: any) => {
          return { ...rutina, secuencias: JSON.parse(rutina.secuencias) };
        });
      })
      .catch((err) => {
        console.log(`getRutinas error: ${err}`);
      });
  };

  const saveRutina = (newRutina: RutinaType): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ ...newRutina, secuencias: JSON.stringify(newRutina.secuencias) }),
    };

    return fetch(`${API_URL}/api/rutina/add`, options)
      .then((res) => res.json())
      .then((result) => {
        if (result.res !== '0') {
          console.log(`saveRutinaError: ${result.message}`);
          return [];
        }

        return result.message;
      })
      .catch((err) => {
        console.log(`saveRutinaError: ${JSON.stringify(err)}`);
      });
  };
  // ************************************* Rutinas Realizadas *************************************

  return {
    isWifiConnected,
    isLoginLoading,
    isApiUp,
    errorLogin,
    token,
    remoteUserId,
    login,
    setErrorLogin,
    clearUserData,
    getJugadores,
    saveJugador,
    getRutinas,
    saveRutina,
  };
}

export default useRemoteStorage;
