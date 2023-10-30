import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import { useCustomRemoteStorage } from '../contexts/RemoteStorageProvider';
import GlobalStyles from '../utils/EstilosGlobales';

interface wifiStatusProps {}

const WifiStatusComponent = ({}: wifiStatusProps) => {
  const [isVisibleWifiStatus, setIsVisibleWifiStatus] = useState<boolean>(true);
  const { isWifiConnected } = useCustomRemoteStorage();

  useEffect(() => {
    setIsVisibleWifiStatus(true);

    setTimeout(() => {
      setIsVisibleWifiStatus(false);
    }, 3000);
  }, [isWifiConnected]);

  if (isVisibleWifiStatus) {
    return (
      <Portal>
        {isWifiConnected ? (
          <View style={[styles.container, { backgroundColor: GlobalStyles.greenAlertColor }]}>
            <Text style={styles.message}>Aplicacion online</Text>
          </View>
        ) : (
          <View style={[styles.container, { backgroundColor: 'red' }]}>
            <Text style={styles.message}>Aplicacion offline</Text>
          </View>
        )}
      </Portal>
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  message: {
    color: GlobalStyles.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WifiStatusComponent;
