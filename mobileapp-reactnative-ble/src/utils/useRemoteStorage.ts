import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';
import { JugadorType } from '../data/JugadoresType';
import { APIResType } from '../data/APIResType';
import { RutinaType } from '../data/RutinasType';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  errorLogin: string;
  token: string;
  remoteUserId: string | undefined;

  login: (user: string, password: string) => void;
  setErrorLogin: (error: string) => void;
  clearStoredToken: () => void;
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

  const [token, setToken] = useState<string>('');
  const [remoteUserId, setRemoteUserId] = useState<string | undefined>();

  useEffect(() => {
    setErrorLogin('');

    // si el token guardado es "local" debe borrarlo y solicitar loguearse de nuevo
    getUserData();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected ?? false);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

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

        if (result.res !== '0') {
          setIsLoginLoading(false);
          if (typeof result.message === 'string') setErrorLogin(result.message);
          return;
        }
        console.log(result.message);

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

  // ****************************************** Token ******************************************

  const getUserData = async () => {
    try {
      AsyncStorage.getItem('userData').then((res) => {
        if (res !== null) {
          const userData = JSON.parse(res);
          setToken(userData.token);
          setRemoteUserId(userData.userId);
        }
      });
    } catch (error) {
      console.log(`getStoredTokenError: ${JSON.stringify(error)}`);
    }
  };

  const storeUserData = async (userData: { token: string; userId: string }) => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setRemoteUserId(userData.userId);
    setToken(userData.userId);
  };

  const clearStoredToken = async () => {
    console.log('token clear');

    await AsyncStorage.setItem('token', '');
    setToken('');
  };

  // ****************************************** Jugadores ******************************************

  const getJugadores = (): Promise<JugadorType[]> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    return fetch(`${API_URL}/api/usuario/JugadorList`, options)
      .then((res) => res.json())
      .then((result) => {
        if (result.res !== '0') return [];
        return result.message;
      })
      .catch((err) => {
        console.log(`getJugadoresErr: ${JSON.stringify(err)}`);
      });
  };

  const saveJugador = (newJugador: JugadorType): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(newJugador),
    };

    return fetch(`${API_URL}/api/jugador/add`, options)
      .then((res) => res.json())
      .then((result) => {
        if (result.res !== '0') {
          console.log(`saveJugadorError: ${JSON.stringify(result.message)}`);
          return [];
        }

        return result.message;
      })
      .catch((err) => {
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
    errorLogin,
    token,
    remoteUserId,
    login,
    setErrorLogin,
    clearStoredToken,
    getJugadores,
    saveJugador,
    getRutinas,
    saveRutina,
  };
}

export default useRemoteStorage;
