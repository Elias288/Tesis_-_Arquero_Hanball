import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { API_URL } from '@env';
import { JugadorType } from '../data/JugadoresType';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { APIResType } from '../data/APIResType';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  errorLogin: string;
  remoteJugadores: JugadorType[];

  login: (user: string, password: string) => void;
  clearErrorLogin: () => void;
}

function useRemoteStorage(): remoteStorageProps {
  const { localToken, saveToken } = useCustomLocalStorage();
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');

  const [remoteJugadores, setRemoteJugadores] = useState<JugadorType[]>([]);

  useEffect(() => {
    clearErrorLogin();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected ?? false);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  const login = (usuario: string, contraseña: string) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    setIsLoginLoading(true);

    const time = setTimeout(() => {
      setIsLoginLoading(false);
      setErrorLogin('Tiempo agotado. Servidor no repondío');
      return;
    }, 10000);

    fetch(`${API_URL}/api/usuario/login`, options)
      .then((res) => res.json())
      .then(
        (result: APIResType) => {
          if (result.res == '0') {
            saveToken(`Bearer ${result.message}`);
            setIsLoginLoading(false);
          } else {
            setIsLoginLoading(false);
            setErrorLogin(result.message);
          }

          return () => clearTimeout(time);
        },
        (err) => {
          setIsLoginLoading(false);
          setErrorLogin(err);
          return () => clearTimeout(time);
        }
      )
      .catch((err) => {
        setIsLoginLoading(false);
        setErrorLogin(err);
        console.log('Catch:' + err);
        return () => clearTimeout(time);
      });
  };

  const clearErrorLogin = () => {
    setErrorLogin('');
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
    clearErrorLogin,
  };
}

export default useRemoteStorage;
