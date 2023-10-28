import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RutinasPage from '../pages/Rutinas.page';
import RutinasRealizadasPage from '../pages/RutinasRealizadas.page';
import ViewRutina from '../pages/ViewRutina.page';
import { RutinaType } from '../data/RutinasType';

export type RutinaTabPages = {
  RutinasPage: undefined;
  RutinasRealizadas: undefined;
  ViewRutina: { selectedId?: number; rutina?: RutinaType };
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
