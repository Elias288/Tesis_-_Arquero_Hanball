import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InicioPage from '../pages/Inicio/Inicio.page';
import JugarPage from '../pages/Jugar/Jugar.page';
import Hist_Jugadores from '../pages/Jugadores/Hist_Jugadores';
import RutinasPage from '../pages/Rutinas/Rutinas.page';

export type InicioTabPages = {
  InicioPage: undefined;
  Jugar: { rutina: string };
  ViewResult: { res: string };
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
  RutinasPage: undefined;
};

const Stack = createNativeStackNavigator<InicioTabPages>();

const InicioTab = () => {
  return (
    <Stack.Navigator initialRouteName="InicioPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InicioPage" component={InicioPage} />
      <Stack.Screen name="Jugar" component={JugarPage} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
    </Stack.Navigator>
  );
};

export default InicioTab;
