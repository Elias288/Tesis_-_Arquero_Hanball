import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Portal } from 'react-native-paper';
import { useCustomRemoteStorage } from '../contexts/RemoteStorageProvider';
import GlobalStyles from '../utils/EstilosGlobales';

interface wifiStatusProps {
  neverHide?: boolean;
  timeToHide?: number;
  style?: StyleProp<ViewStyle>;
}

const WifiStatusComponent = ({
  neverHide,
  timeToHide = 3000,
  style: styleProp,
}: wifiStatusProps) => {
  const [isVisibleWifiStatus, setIsVisibleWifiStatus] = useState<boolean>(true);
  const { isWifiConnected } = useCustomRemoteStorage();

  useEffect(() => {
    setIsVisibleWifiStatus(true);

    if (!neverHide) {
      setTimeout(() => {
        setIsVisibleWifiStatus(false);
      }, timeToHide);
    }
  }, [isWifiConnected]);

  if (isVisibleWifiStatus) {
    return (
      <Portal>
        {isWifiConnected ? (
          <View
            style={[styles.container, { backgroundColor: GlobalStyles.greenAlertColor }, styleProp]}
          >
            <Text style={styles.message}>Aplicacion online</Text>
          </View>
        ) : (
          <View style={[styles.container, { backgroundColor: 'red' }, styleProp]}>
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
