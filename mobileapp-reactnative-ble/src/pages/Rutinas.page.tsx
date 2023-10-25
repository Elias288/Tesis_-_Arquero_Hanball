import { View } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../components/Header.component';
import { IconButton } from 'react-native-paper';

import { RutinaTabPages } from '../navigation/RutinasTab';
import ListarRutinasComponent from '../components/ListarRutinas.component';
import ModalAgregarRutina from '../components/ModalAgregarRutina.component';

type propsType = NativeStackScreenProps<RutinaTabPages, 'RutinasPage'>;

const RutinasPage = (props: propsType) => {
  const { navigation, route } = props;
  const [visibleModal, setVisibleModal] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent title={'Rutinas'} showBackButton={true} />

      <ListarRutinasComponent navigation={navigation} />

      <ModalAgregarRutina isVisible={visibleModal} hideModal={() => setVisibleModal(false)} />

      <View>
        <IconButton
          icon={'plus'}
          mode="contained"
          containerColor="#e7d84f"
          iconColor="#fff"
          size={40}
          style={{ position: 'absolute', right: 20, bottom: 20 }}
          onPress={() => setVisibleModal(true)}
        />
      </View>
    </View>
  );
};

export default RutinasPage;
