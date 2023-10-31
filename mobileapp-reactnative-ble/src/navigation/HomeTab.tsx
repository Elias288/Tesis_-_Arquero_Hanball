import { NavigatorScreenParams } from '@react-navigation/native';
import InicioTab, { inicioTabPages } from './InicioTab';
import ListaJugadoresTab, { ListaJugadoresTabPages } from './ListaJugadoresTab';
import RutinasTab, { RutinaTabPages } from './RutinasTab';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles from '../utils/EstilosGlobales';
import { useEffect } from 'react';
import { useCustomBLE } from '../contexts/BLEProvider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, Portal } from 'react-native-paper';
import HandleMSGs from '../utils/HandleMSGs';
import WifiStatusComponent from '../components/WifiStatus.component';
import useLocalStorage from '../utils/useLocalStorage';
import useRemoteStorage from '../utils/useRemoteStorage';

export type HomeTabs = {
  Inicio: NavigatorScreenParams<inicioTabPages>;
  Jugadores: NavigatorScreenParams<ListaJugadoresTabPages>;
  Rutinas: NavigatorScreenParams<RutinaTabPages>;
};

const Tab = createBottomTabNavigator<HomeTabs>();

const Home = () => {
  const { initBle } = useCustomBLE();

  useEffect(() => {
    initBle();
  }, []);

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
      </PaperProvider>
    </>
  );
};

export default Home;
