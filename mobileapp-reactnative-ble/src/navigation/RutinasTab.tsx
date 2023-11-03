import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RutinasPage from '../pages/Rutinas/Rutinas.page';
import RutinasRealizadasPage from '../pages/Rutinas/RutinasRealizadas.page';
import ViewRutina from '../pages/Rutinas/ViewRutina.page';
import ViewRutinaResultado from '../pages/Rutinas/ViewRutinaResultado.page';

export type RutinaTabPages = {
  RutinasPage: undefined;
  RutinasRealizadas: undefined;
  ViewRutina: { rutinaId: string };
  ViewRutinaResultado: { rutina: string };
};

const Stack = createNativeStackNavigator<RutinaTabPages>();

const RutinasTab = () => {
  return (
    <Stack.Navigator initialRouteName="RutinasPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
      <Stack.Screen name="RutinasRealizadas" component={RutinasRealizadasPage} />
      <Stack.Screen name="ViewRutina" component={ViewRutina} />
      <Stack.Screen name="ViewRutinaResultado" component={ViewRutinaResultado} />
    </Stack.Navigator>
  );
};

export default RutinasTab;
