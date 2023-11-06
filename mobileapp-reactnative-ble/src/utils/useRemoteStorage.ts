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

  login: (user: string, password: string) => void;
  clearErrorLogin: () => void;
  clearStoredToken: () => void;
  getJugadores: () => Promise<JugadorType[]>;
  getRutinas: () => Promise<RutinaType[]>;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');

  const [token, setToken] = useState<string>('');

  useEffect(() => {
    clearErrorLogin();

    // si el token guardado es "local" debe borrarlo y solicitar loguearse de nuevo
    getStoredToken().then((token) => {
      if (token) {
        if (token !== 'local') {
          setToken(token);
        } else {
          storeToken('');
        }
      }
    });

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

    const time = setTimeout(() => {
      // si el tiempo se agota y no se pudo conectar con la API el token guardado será "local"
      setIsLoginLoading(false);
      storeToken('local');
      return;
      // }, 2000);
    }, 10000);

    const options = {
      method: 'POST',
      body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${API_URL}/api/usuario/login`, options)
      .then((res) => res.json())
      .then((result: APIResType) => {
        clearTimeout(time);

        if (result.res !== '0') {
          setIsLoginLoading(false);
          if (typeof result.message === 'string') setErrorLogin(result.message);
          return;
        }

        const loggedToken = `Bearer ${result.message}`;
        setToken(loggedToken);
        storeToken(loggedToken);
        setIsLoginLoading(false);
      })
      .catch((err) => {
        clearTimeout(time);
        setIsLoginLoading(false);
        setErrorLogin(err);
        console.log('CatchLogin:' + err);
      });
  };

  const clearErrorLogin = () => {
    setErrorLogin('');
  };

  // ****************************************** Token ******************************************

  const getStoredToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // console.log(value);
        // setToken(value);
        return value;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setToken(token);
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
        if (result.res !== '0') {
          console.log(result.message);
          return [];
        }

        return result.message;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ****************************************** Rutinas ******************************************

  const getRutinas = (): Promise<RutinaType[]> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    return fetch(`${API_URL}/api/usuario/RutinaList`, options)
      .then((res) => res.json())
      .then((result) => {
        if (result.res !== '0') {
          console.log(result.message);
          return [];
        }

        return result.message;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ************************************* Rutinas Realizadas *************************************

  return {
    isWifiConnected,
    isLoginLoading,
    errorLogin,
    token: token,
    login,
    clearErrorLogin,
    clearStoredToken,
    getJugadores,
    getRutinas,
  };
}

export default useRemoteStorage;
