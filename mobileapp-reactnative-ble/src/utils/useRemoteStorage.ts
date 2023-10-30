import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export interface remoteStorageProps {
  isWifiConnected: boolean;
}

function useRemoteStorage(): remoteStorageProps {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected ?? false);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  return {
    isWifiConnected,
  };
}

export default useRemoteStorage;
