import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/Home.page';
import JugarPage from '../pages/Jugar.page';
import ViewResultPage from '../pages/ViewResult.page';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import DemoCrearSecuenca from '../pages/CrearSecuencia';
import Secuencias from '../pages/Secuencias';
import { RutinaType } from '../data/ListaRutinas.data';

export type HomeTabPages = {
  HomePage: undefined;
  Jugar: { rutina: RutinaType };
  ViewResult: { res: string };
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
      <Stack.Screen name="Jugar" component={JugarPage} />
      <Stack.Screen name="ViewResult" component={ViewResultPage} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="Secuencias" component={Secuencias} />
      <Stack.Screen name="DemoCrearSecuenca" component={DemoCrearSecuenca} />
    </Stack.Navigator>
  );
};

export default HomeTab;
