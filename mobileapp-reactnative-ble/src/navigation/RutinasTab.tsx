import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RutinasPage from '../pages/Rutinas.page';

export type RutinaTabPages = {
  RutinasPage: undefined;
};

const Stack = createNativeStackNavigator<RutinaTabPages>();

const RutinasTab = () => {
  return (
    <Stack.Navigator initialRouteName="RutinasPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RutinasPage" component={RutinasPage} />
    </Stack.Navigator>
  );
};

export default RutinasTab;
