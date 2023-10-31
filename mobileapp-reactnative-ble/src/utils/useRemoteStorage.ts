import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { API_URL } from '@env';
import { JugadorType } from '../data/JugadoresType';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  errorLogin: string;
  remoteJugadores: JugadorType[];

  login: (user: string, password: string) => void;
}

function useRemoteStorage(): remoteStorageProps {
  const { localToken, saveToken } = useCustomLocalStorage();
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');

  const [remoteJugadores, setRemoteJugadores] = useState<JugadorType[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected ?? false);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (localToken && remoteJugadores.length == 0) {
      getJugadores();
    }
  }, [localToken]);

  const login = (usuario: string, contraseña: string) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${API_URL}/api/usuario/login`, options)
      .then((res) => res.json())
      .then(
        (result) => {
          saveToken(`Bearer ${result.token}`);
          setIsLoginLoading(false);
        },
        (error) => {
          setIsLoginLoading(false);
          setErrorLogin(error);
          console.log(error);
        }
      );
  };

  const getJugadores = () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localToken,
      },
    };
    if (localToken.trim() !== '') {
      fetch(`${API_URL}/api/usuario/JugadorList`, options)
        .then((res) => res.json())
        .then(
          (result) => {
            console.log('getJugadores: ' + JSON.stringify(result.result, null, 4));

            setRemoteJugadores(result.result);
          },
          (error) => {
            setIsLoginLoading(false);
            setErrorLogin(error);
            console.log(error);
          }
        );
    }
  };

  return {
    isWifiConnected,
    isLoginLoading,
    errorLogin,
    remoteJugadores,
    login,
  };
}

export default useRemoteStorage;
