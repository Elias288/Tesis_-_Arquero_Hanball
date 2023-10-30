import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InicioPage from '../pages/Inicio/Inicio.page';
import JugarPage from '../pages/Jugar/Jugar.page';
import RutinasPage from '../pages/Rutinas/Rutinas.page';

export type inicioTabPages = {
  InicioPage: undefined;
  Jugar: { rutina: string };
  ViewResult: { res: string };
  Agregar_Jug: undefined;
  RutinasPage: undefined;
};

const Stack = createNativeStackNavigator<inicioTabPages>();

const InicioTab = () => {
  return (
    <Stack.Navigator initialRouteName="InicioPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InicioPage" component={InicioPage} />
      <Stack.Screen name="Jugar" component={JugarPage} />
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
    </Stack.Navigator>
  );
};

export default InicioTab;
