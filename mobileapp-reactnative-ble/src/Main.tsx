import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import ListaJugadoresPage from './pages/ListaJugadores.page';
import Secuencias from './pages/Secuencias';
import AllScreens from './components/AllScreens';
import { useCustomBLEProvider } from './utils/BLEProvider';
import HandleMSGs from './utils/HandleMSGs';

/************************************************* Main *************************************************/
type screenType = {
  Home: undefined;
  List: { jug: string };
  Secuencia: undefined;
  AllScreens: undefined;
};
const Tab = createBottomTabNavigator<screenType>();
interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

const Main = () => {
  const { espStatus, scanAndConnectPeripherals, requestPermissions } = useCustomBLEProvider();
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMsg, SetsnackbarMsg] = useState<string>('Hola');

  const funciones: Funciones = {
    // resultado del juego
    res: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
    },

    // saludo desde el servidor BLE
    saludo: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
    },
  };

  useEffect(() => {
    if (espStatus) {
      scanForDevices();
    }
  }, []);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
    }
  };

  const pageOptions = (routeName: string, focused: boolean) => {
    let iconName = '';
    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'List':
        iconName = focused ? 'account-group' : 'account-group-outline';
        break;
      case 'Secuencia':
        iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
        break;
    }
    return <Icon name={iconName} size={30} color="#3CB371" />;
  };

  return (
    <NavigationContainer>
      <PaperProvider>
        <HandleMSGs funcion={funciones} />
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              return pageOptions(route.name, focused);
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={AllScreens}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="List"
            component={ListaJugadoresPage}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Secuencia"
            component={Secuencias}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ffffff',
  },
});

export default Main;
