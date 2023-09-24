import React from 'react';
// import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { BleError, Device } from 'react-native-ble-plx';

import Home from './pages/Home';
import Jugar from './pages/Jugar';
import JugarSec from './pages/JugarSecuencia';
import ListJugadores from './pages/List';
import Secuencias from './pages/Secuencias';
import DemoHome from './Demo_Home';

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

const Stack = createNativeStackNavigator<stackScreens>();

const Main = () => {
  return (
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
  );
};

export default Main;
