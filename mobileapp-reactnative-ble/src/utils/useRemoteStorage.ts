import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { API_URL } from '@env';
import useLocalStorage from './useLocalStorage';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  token: string;
  errorLogin: string;

  login: (user: string, password: string) => void;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(true);
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const { saveToken } = useLocalStorage();

  useEffect(() => {
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
    fetch(`${API_URL}/api/usuario/login`, options)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setToken(`Bearer ${result.token}`);
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

  return {
    isWifiConnected,
    isLoginLoading,
    token,
    errorLogin,
    login,
  };
}

export default useRemoteStorage;
