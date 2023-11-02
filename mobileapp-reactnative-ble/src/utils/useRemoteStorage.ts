import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { API_URL } from '@env';
import useLocalStorage from './useLocalStorage';

export interface remoteStorageProps {
  isWifiConnected: boolean;
  isLoginLoading: boolean;
  errorLogin: string;

  login: (user: string, password: string) => void;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>('');
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
    if (isWifiConnected) {
      const options = {
        method: 'POST',
        body: JSON.stringify({ username: usuario, contrasenia: contraseña }),
        headers: {
          'Content-Type': 'application/json',
        },
        timeoutDuration: 2000,
      };
      setIsLoginLoading(true);
      
      setTimeout(() => {
        setIsLoginLoading(false);
        saveToken('Elias el mejor');
        return;
      }, 2000);

      fetch(`${API_URL}/api/usuario/login`, options)
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
            saveToken(`Bearer ${result.token}`);
            setIsLoginLoading(false);
          },
          (error) => {
            setIsLoginLoading(false);
            setErrorLogin(error);
          }
        )
        .catch((err) => {
          setIsLoginLoading(false);
          console.log(err);
        });
    } else {
      saveToken('Elias el mejor');
    }
  };

  return {
    isWifiConnected,
    isLoginLoading,
    errorLogin,
    login,
  };
}

export default useRemoteStorage;
