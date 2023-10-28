import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RutinasPage from '../pages/Rutinas.page';
import RutinasCargadasPage from '../pages/RutinasCargadas.page';
import ViewRutina from '../pages/ViewRutina.page';
import { RutinaType } from '../data/RutinasType';

export type RutinaTabPages = {
  RutinasPage: undefined;
  RutinasCargadas: undefined;
  ViewRutina: { selectedId?: number, rutina?: RutinaType };
};

const Stack = createNativeStackNavigator<RutinaTabPages>();

const RutinasTab = () => {
  return (
    <Stack.Navigator initialRouteName="RutinasPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
      <Stack.Screen name="RutinasCargadas" component={RutinasCargadasPage} />
      <Stack.Screen name="ViewRutina" component={ViewRutina} />
    </Stack.Navigator>
  );
};

export default RutinasTab;
