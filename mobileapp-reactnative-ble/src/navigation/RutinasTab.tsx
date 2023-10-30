import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RutinasPage from '../pages/Rutinas/Rutinas.page';
import RutinasRealizadasPage from '../pages/Rutinas/RutinasRealizadas.page';
import ViewRutina from '../pages/Rutinas/ViewRutina.page';

export type RutinaTabPages = {
  RutinasPage: undefined;
  RutinasRealizadas: undefined;
  ViewRutina: { rutinaId?: number; rutina?: string; isRutinaResultado: boolean };
};

const Stack = createNativeStackNavigator<RutinaTabPages>();

const RutinasTab = () => {
  return (
    <Stack.Navigator initialRouteName="RutinasPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
      <Stack.Screen name="RutinasRealizadas" component={RutinasRealizadasPage} />
      <Stack.Screen name="ViewRutina" component={ViewRutina} />
    </Stack.Navigator>
  );
};

export default RutinasTab;
