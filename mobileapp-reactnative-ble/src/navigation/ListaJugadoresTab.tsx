import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewJugadorComponent from '../pages/Jugadores/ViewJugador/ViewJugador.component';
import JugadoresPage from '../pages/Jugadores/Jugadores.page';

export type ListaJugadoresTabPages = {
  ListaJugadores: undefined;
  ViewJugadores: { jugadorId: number };
};

const Stack = createNativeStackNavigator<ListaJugadoresTabPages>();

const ListaJugadoresTab = () => {
  return (
    <Stack.Navigator initialRouteName="ListaJugadores" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaJugadores" component={JugadoresPage} />
      <Stack.Screen name="ViewJugadores" component={ViewJugadorComponent} />
    </Stack.Navigator>
  );
};

export default ListaJugadoresTab;
