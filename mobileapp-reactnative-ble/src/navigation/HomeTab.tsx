import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/Home.page';
import JugarPage from '../pages/Jugar.page';
import ViewResultPage from '../pages/ViewResult.page';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import DemoCrearSecuenca from '../pages/CrearSecuencia';
import RutinasPage from '../pages/Rutinas.page';
import { RutinaType } from '../data/RutinasType';

export type HomeTabPages = {
  HomePage: undefined;
  Jugar: { rutina: RutinaType };
  ViewResult: { res: string };
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
  RutinasPage: undefined;
};

const Stack = createNativeStackNavigator<HomeTabPages>();

const HomeTab = () => {
  return (
    <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Jugar" component={JugarPage} />
      <Stack.Screen name="ViewResult" component={ViewResultPage} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
    </Stack.Navigator>
  );
};

export default HomeTab;
