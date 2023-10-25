import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearSecuencaDef from '../pages/CrearSecuenciaDef.page';
import RutinasPage from '../pages/Rutinas.page';

export type SecuenciasTabPages = {
  Rutinas: undefined;
  CrearSecuencaDef: undefined;
};

const Stack = createNativeStackNavigator<SecuenciasTabPages>();

const RutinasTab = () => {
  return (
    <Stack.Navigator initialRouteName="Rutinas" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Rutinas" component={RutinasPage} />
      <Stack.Screen name="CrearSecuencaDef" component={CrearSecuencaDef} />
    </Stack.Navigator>
  );
};

export default RutinasTab;
