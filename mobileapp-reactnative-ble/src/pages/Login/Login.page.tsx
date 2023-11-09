/*
 * Esta es la primera pantalla que se carga en la app.
 * Si el token de useCustomRemoteStorage está vació significa que el usuario no está logueado
 * Si el token tiene texto significa que está logueado
 */
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import WifiStatusComponent from '../../components/WifiStatus.component';
import LoginFormComponent from './LoginForm.component';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';
import { RootTabs } from '../../Main';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';

type propsType = NativeStackScreenProps<RootTabs>;

const LoginPage = ({ navigation }: propsType) => {
  const { isWifiConnected, token, clearStoredToken, setErrorLogin } = useCustomRemoteStorage();
  const { clearJugadoresDB, clearRutinasRealizadas, clearRutinasDB } = useCustomLocalStorage();

  const [isConnectedLoading, setIsConnectedLoading] = useState(true);

  useEffect(() => {
    // clearRutinasDB();
    // clearJugadoresDB();
    // clearRutinasRealizadas();
    // clearStoredToken();

    if (isWifiConnected) {
      // si el wifi está conectado a wifi inicia login
      setIsConnectedLoading(false);
    }

    if (token !== '') {
      navigation.navigate('Home');
    }
  }, [isWifiConnected, token]);

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: GlobalStyles.grayBackground }}>
        <View style={styles.container}>
          <Text style={styles.text}>Login</Text>
        </View>

        <View style={styles.body}>
          <View style={{ paddingHorizontal: 30 }}>
            {isConnectedLoading && (
              <ActivityIndicator animating={true} color={GlobalStyles.blueBackground} size={100} />
            )}

            {!isConnectedLoading && <LoginFormComponent />}

            <WifiStatusComponent neverHide={true} style={{ bottom: 0 }} />
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3CB371',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  text: {
    color: GlobalStyles.white,
    textAlign: 'center',
    flex: 1,
    padding: 15,
    fontSize: 25,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoginPage;
