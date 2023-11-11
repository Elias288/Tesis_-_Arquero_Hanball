import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ViewJugadorPage from '../components/ViewJugador/ViewJugador.page';
import JugadoresPage from '../pages/Jugadores/Jugadores.page';

export type ListaJugadoresTabPages = {
  ListaJugadores: undefined;
  ViewJugadores: { jugadorNombre: string };
};

const Stack = createNativeStackNavigator<ListaJugadoresTabPages>();

const ListaJugadoresTab = () => {
  return (
    <Stack.Navigator initialRouteName="ListaJugadores" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaJugadores" component={JugadoresPage} />
      <Stack.Screen name="ViewJugadores" component={ViewJugadorPage} />
    </Stack.Navigator>
  );
};

export default ListaJugadoresTab;
