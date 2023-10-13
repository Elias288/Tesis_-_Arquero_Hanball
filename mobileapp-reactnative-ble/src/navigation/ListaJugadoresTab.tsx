import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaJugadoresPages from '../pages/ListaJugadores.page';
import Hist_Jugadores from '../pages/Hist_Jugadores';
import Agregar_Jug from '../pages/Agregar_Jug';

export type ListaJugadoresTabPages = {
  ListaJugadores: undefined;
  Agregar_Jug: undefined;
  Hist_Jugadores: { name: string };
};

const Stack = createNativeStackNavigator<ListaJugadoresTabPages>();

const ListaJugadoresTab = () => {
  return (
    <Stack.Navigator initialRouteName="ListaJugadores" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaJugadores" component={ListaJugadoresPages} />
      <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores} />
      <Stack.Screen name="Agregar_Jug" component={Agregar_Jug} />
    </Stack.Navigator>
  );
};

export default ListaJugadoresTab;
