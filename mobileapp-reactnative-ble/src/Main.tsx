import { StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from 'react';
import { Portal, Snackbar, PaperProvider } from 'react-native-paper';

import ListJugadores from './pages/List';
import Secuencias from './pages/Secuencias';
import AllScreens from './pages/AllScreens';
import { useCustomBLEProvider } from './utils/BLEProvider';

/* type homeProps = {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  disconnectFromDevice: () => void;
  sendData(device: Device, msg: string): Promise<void>;
  connectToDevice(device: Device): void;
  connectedDevice: Device | undefined;
  BLEmsg: string | BleError;
  espStatus: Boolean;
}; */
/************************************************* Main *************************************************/
type screenType={
  Home:undefined,
  List: {jug:string};
  Secuencia:undefined,
  AllScreens:undefined
}
const Tab = createBottomTabNavigator<screenType>();
interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

const Main = () => {
  const { receivedMSG } = useCustomBLEProvider();
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMsg, SetsnackbarMsg] = useState<string>('Hola');

  const funciones: Funciones = {
    res: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
    },
    saludo: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
    },
  };

  useEffect(() => {
    const partes = receivedMSG.split('\t');
    partes.forEach((parte) => {
      const [nombreFuncion, dato] = parte.split(':');
      const funcion = funciones[nombreFuncion];
      if (funcion) {
        funcion(dato);
      }
    });
  }, [receivedMSG]);

  return (
    <PaperProvider>
      <Portal>
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => setVisibleSnackbar(false)}
          action={{
            label: 'Undo',
            onPress: () => {
              setVisibleSnackbar(false);
            },
          }}
        >
          {snackbarMsg}
        </Snackbar>
      </Portal>
      <Tab.Navigator initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            switch ( route.name ) {
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
            return <Icon name = { iconName } size = {30} color="#3CB371"/>
        }
        })}>
            <Tab.Screen name="Home" component={AllScreens} 
                options={{
                    headerStyle: {
                        backgroundColor: "#3CB371",
                    },
                    headerTitleAlign: "center",
                    headerTitle: () => (
                        <Text style={styles.header}>DEAH App</Text>
                    ), 
                    headerRight: () => (
                        <Icon name = 'cog' size={30} color="#ffffff"/>
                    ),
                    headerLeft: () => (
                        <Text style={styles.header}>BLE Status</Text>
                    ),
                }}/>
            <Tab.Screen name="List" component={ListJugadores} 
                options={{
                    headerStyle: {
                        backgroundColor: "#3CB371",
                    },
                    headerTitleAlign: "center",
                    headerTitle: () => (
                        <Text style={styles.header}>Lista de Jugadores</Text>
                    ), 
                    headerRight: () => (
                        <Icon name = 'cog' size={30} color="#ffffff"/>
                    ),
                    headerLeft: () => (
                        <Text style={styles.header}>BLE Status</Text>
                    ),
                }}/>
            <Tab.Screen name="Secuencia" component={Secuencias} 
                options={{
                    headerStyle: {
                        backgroundColor: "#3CB371",
                    },
                    headerTitleAlign: "center",
                    headerTitle: () => (
                        <Text style={styles.header}>Secuencias</Text>
                    ), 
                    headerRight: () => (
                        <Icon name = 'cog' size={30} color="#ffffff"/>
                    ),
                    headerLeft: () => (
                        <Text style={styles.header}>BLE Status</Text>
                    ),
                }}/>
        </Tab.Navigator>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  header:{
    fontWeight: "bold",
    fontSize: 20,
    color: "#ffffff"
}
});

export default Main;
