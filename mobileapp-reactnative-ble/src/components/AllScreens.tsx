import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/Home.page';
import ListaJugadoresPage from '../pages/ListaJugadores.page';
import Jugar from '../pages/Jugar';
import Secuencias from '../pages/Secuencias';
import JugarSec from '../pages/JugarSecuencia';
import Agregar_Jug from '../pages/Agregar_Jug';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import DemoCrearSecuenca from '../pages/CrearSecuencia';

export type stackScreens = {
  HomePage: undefined;
  Jugar: undefined;
  List: { jug: string };
  Secuencias: undefined;
  JugarSec: { jug: string };
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
  DemoCrearSecuenca: undefined;
};

const Stack = createNativeStackNavigator<stackScreens>();

const AllScreens = () => {
  return (
    <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Jugar" component={Jugar} />
      <Stack.Screen name="List" component={ListaJugadoresPage} />
      <Stack.Screen name="Secuencias" component={Secuencias} />
      <Stack.Screen name="JugarSec" component={JugarSec} />
      <Stack.Screen name="Agregar_Jug" component={Agregar_Jug} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="DemoCrearSecuenca" component={DemoCrearSecuenca} />
    </Stack.Navigator>
  );
};

export default AllScreens;

const styles = StyleSheet.create({});
