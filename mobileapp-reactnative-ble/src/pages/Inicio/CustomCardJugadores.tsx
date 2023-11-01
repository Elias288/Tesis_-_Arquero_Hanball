import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import sortType from '../../utils/sortType';
import ListarJugadoresComponent from '../../components/ListarJugadores/ListarJugadores.component';
import CustomCard, { cardStyles } from './CustomCard';
import OptionButtons from './OptionButtons';
import ModalCrearJugador from '../Jugadores/ModalCrearJugador.component';
import { HomeTabs } from '../../navigation/HomeTab';

const CustomCardJugadores: FC = () => {
  const [isVisibleAgregarJugador, setVisibleAgregarJugador] = useState(false);
  const navigator = useNavigation<NativeStackNavigationProp<HomeTabs>>();

  const gotAgregarJugador = () => {
    navigator.navigate('Jugadores', { screen: 'ListaJugadores' });
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Jugadores</Text>

      <OptionButtons
        text="Agregar Jugador"
        icon="account-plus"
        action={() => setVisibleAgregarJugador(true)}
      />

      <ModalCrearJugador
        hideModal={() => setVisibleAgregarJugador(false)}
        isVisible={isVisibleAgregarJugador}
      />

      <View style={{ paddingTop: 15 }}>
        <Text>Últimos jugadores agregados</Text>
        <ListarJugadoresComponent
          cantRenderItems={2}
          isSimpleList={true}
          sort={sortType.newestFirst}
          navigation={navigator}
        />
      </View>

      <Button textColor="#000" onPress={gotAgregarJugador}>
        Ver más
      </Button>
    </CustomCard>
  );
};

export default CustomCardJugadores;
