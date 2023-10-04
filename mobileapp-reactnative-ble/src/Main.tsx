import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Portal, Snackbar, PaperProvider } from 'react-native-paper';

import Home from './pages/Home';
import Jugar from './pages/Jugar';
import JugarSec from './pages/JugarSecuencia';
import ListJugadores from './pages/List';
import Secuencias from './pages/Secuencias';
import DemoHome from './Demo_Home';
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
export type stackScreens = {
  Home: undefined;
  // Home: homeProps;
  Jugar: undefined;
  List: undefined;
  Secuencias: undefined;
  JugarSec: { jug: string };
};

interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

const Stack = createNativeStackNavigator<stackScreens>();

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
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={DemoHome} />
          {/* <Stack.Screen name="Home" component={Home} /> */}
          <Stack.Screen name="Jugar" component={Jugar} />
          <Stack.Screen name="List" component={ListJugadores} />
          <Stack.Screen name="Secuencias" component={Secuencias} />
          <Stack.Screen name="JugarSec" component={JugarSec} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Main;
