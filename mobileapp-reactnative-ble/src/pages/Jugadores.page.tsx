import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../components/Header.component';
import ListarJugadoresComponent from '../components/ListarJugadores.component';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';
import { ListaJugadoresTabPages } from '../navigation/ListaJugadoresTab';
import ModalAgregarJugador from '../components/ModalAgregarJugador.component';

type propsType = NativeStackScreenProps<ListaJugadoresTabPages, 'ListaJugadores'>;

const JugadoresPage = (props: propsType) => {
  const { navigation, route } = props;
  const [visible, setVisible] = useState(false);

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title={'Lista de Jugadores'} showBackButton={true} />

      <ListarJugadoresComponent navigation={navigation} />

      {/* Agregar jugador como modal */}
      <ModalAgregarJugador visible={visible} hideModal={hideModal} />

      <IconButton
        icon={'plus'}
        mode="contained"
        containerColor="#e7d84f"
        iconColor="#fff"
        size={40}
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={() => setVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 4,
    fontSize: 18,
    marginLeft: 5,
  },
});

export default JugadoresPage;
