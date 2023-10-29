import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../../components/Header.component';
import { IconButton } from 'react-native-paper';

import ModalCrearJugador from '../../components/ModalCrearJugador.component';
import GlobalStyles from '../../utils/EstilosGlobales';
import ListarJugadoresComponent from '../../components/ListarJugadores.component';
import { ListaJugadoresTabPages } from '../../navigation/ListaJugadoresTab';

type propsType = NativeStackScreenProps<ListaJugadoresTabPages, 'ListaJugadores'>;

const JugadoresPage = (props: propsType) => {
  const [visible, setVisible] = useState(false);

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.grayBackground }}>
      <HeaderComponent title={'Lista de Jugadores'} showBackButton={true} />

      <ListarJugadoresComponent />

      {/* Agregar jugador como modal */}
      <ModalCrearJugador isVisible={visible} hideModal={hideModal} />

      <IconButton
        icon={'plus'}
        mode="contained"
        containerColor={GlobalStyles.yellowBackColor}
        iconColor={GlobalStyles.white}
        size={40}
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={() => setVisible(true)}
      />
    </View>
  );
};

export default JugadoresPage;
