import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/Home.page';
import JugarPage from '../pages/Jugar.page';
import ViewResultPage from '../pages/ViewResult.page';
import Agregar_Jug from '../pages/Agregar_Jug';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import CrearSecuenca from '../pages/CrearSecuencia';
import Secuencias from '../pages/Secuencias';
import { RutinaType } from '../data/ListaRutinas.data';

export type HomeTabPages = {
  HomePage: undefined;
  Jugar: { rutina: RutinaType };
  ViewResult: { res: string };
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
  Secuencias: undefined;
  CrearSecuenca: undefined;
};

const Stack = createNativeStackNavigator<HomeTabPages>();

const HomeTab = () => {
  return (
    <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Jugar" component={JugarPage} />
      <Stack.Screen name="ViewResult" component={ViewResultPage} />
      <Stack.Screen name="Agregar_Jug" component={Agregar_Jug} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="Secuencias" component={Secuencias} />
      <Stack.Screen name="CrearSecuenca" component={CrearSecuenca} />
    </Stack.Navigator>
  );
};

export default HomeTab;
