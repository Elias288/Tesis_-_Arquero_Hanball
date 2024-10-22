import { useEffect, useState } from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, PaperProvider, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GlobalStyles from '../utils/EstilosGlobales';
import HandleMSGs from '../utils/HandleMSGs';
import WifiStatusComponent from '../components/WifiStatus.component';
import InicioTab, { inicioTabPages } from './InicioTab';
import ListaJugadoresTab, { ListaJugadoresTabPages } from './ListaJugadoresTab';
import RutinasTab, { RutinaTabPages } from './RutinasTab';
import { useCustomBLE } from '../contexts/BLEProvider';
import { useCustomRemoteStorage } from '../contexts/RemoteStorageProvider';
import { RootTabs } from '../Main';
import { View } from 'react-native';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';

export type HomeTabs = {
  Inicio: NavigatorScreenParams<inicioTabPages>;
  Jugadores: NavigatorScreenParams<ListaJugadoresTabPages>;
  Rutinas: NavigatorScreenParams<RutinaTabPages>;
};

const Tab = createBottomTabNavigator<HomeTabs>();
type propsType = NativeStackScreenProps<RootTabs>;

const Home = ({ navigation }: propsType) => {
  const { initBle } = useCustomBLE();
  const { token, isApiUp } = useCustomRemoteStorage();
  const { chargeAllJugadores, chargeAllRutinas } = useCustomLocalStorage();

  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingData(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loadingData) initBle();
  }, [loadingData]);

  useEffect(() => {
    if (token === '') {
      navigation.navigate('Login');
    }

    chargeAllRutinas();
    chargeAllJugadores();
  }, [token, isApiUp]);

  const pageOptions = (routeName: string, focused: boolean) => {
    let iconName = '';
    switch (routeName) {
      case 'Inicio':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Jugadores':
        iconName = focused ? 'account-group' : 'account-group-outline';
        break;
      case 'Rutinas':
        iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
        break;
    }
    return <Icon name={iconName} size={30} color={GlobalStyles.greenBackColor} />;
  };

  return (
    <>
      <PaperProvider>
        <HandleMSGs />
        {!loadingData && (
          <>
            <Tab.Navigator
              initialRouteName="Inicio"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  return pageOptions(route.name, focused);
                },
              })}
            >
              <Tab.Screen
                name="Inicio"
                component={InicioTab}
                options={{
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Jugadores"
                component={ListaJugadoresTab}
                options={{
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Rutinas"
                component={RutinasTab}
                options={{
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
            <Portal>
              <WifiStatusComponent />
            </Portal>
          </>
        )}

        {loadingData && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator animating={true} color={GlobalStyles.blueBackground} size={80} />
          </View>
        )}
      </PaperProvider>
    </>
  );
};

export default Home;
