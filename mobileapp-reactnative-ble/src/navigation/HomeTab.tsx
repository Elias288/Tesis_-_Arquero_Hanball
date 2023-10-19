import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/Home.page';
import Jugar from '../pages/Jugar';
import JugarSec from '../pages/JugarSecuencia';
import Agregar_Jug from '../pages/Agregar_Jug';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import DemoCrearSecuenca from '../pages/CrearSecuencia';
import Secuencias from '../pages/Secuencias';
import { RutinaType } from '../data/ListaRutinas.data';

export type HomeTabPages = {
  HomePage: undefined;
  Jugar: { rutina: RutinaType };
  JugarSec: { jug: string };
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
  Secuencias: undefined;
  DemoCrearSecuenca: undefined;
};

const Stack = createNativeStackNavigator<HomeTabPages>();

const HomeTab = () => {
  return (
    <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Jugar" component={Jugar} />
      <Stack.Screen name="JugarSec" component={JugarSec} />
      <Stack.Screen name="Agregar_Jug" component={Agregar_Jug} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="Secuencias" component={Secuencias} />
      <Stack.Screen name="DemoCrearSecuenca" component={DemoCrearSecuenca} />
    </Stack.Navigator>
  );
};

export default HomeTab;

const styles = StyleSheet.create({});
