import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearSecuencaDef from '../pages/CrearSecuenciaDef.page';
import Secuencias from '../pages/Secuencias';

export type SecuenciasTabPages = {
  Secuencias: undefined;
  CrearSecuencaDef: undefined;
};

const Stack = createNativeStackNavigator<SecuenciasTabPages>();

const SecuenciasTab = () => {
  return (
    <Stack.Navigator initialRouteName="Secuencias" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Secuencias" component={Secuencias} />
      <Stack.Screen name="CrearSecuencaDef" component={CrearSecuencaDef} />
    </Stack.Navigator>
  );
};

export default SecuenciasTab;
