import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import JugadoresPage from '../pages/Jugadores.page';

export type ListaJugadoresTabPages = {
  ListaJugadores: undefined;
  Hist_Jugadores: { name: string };
};

const Stack = createNativeStackNavigator<ListaJugadoresTabPages>();

const ListaJugadoresTab = () => {
  return (
    <Stack.Navigator initialRouteName="ListaJugadores" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaJugadores" component={JugadoresPage} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
    </Stack.Navigator>
  );
};

export default ListaJugadoresTab;
