import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';

import { inicioTabPages } from '../../navigation/InicioTab';
import HeaderComponent from '../../components/Header/Header.component';
import CustomCardHistorialRutinas from './CustomCardHistorialRutinas';
import CustomCardCrearRutinas from './CustomCardCrearRutinas';
import CustomCardJugadores from './CustomCardJugadores';
import { HomeTabs } from '../../navigation/HomeTab';

type propsType = CompositeScreenProps<
  NativeStackScreenProps<inicioTabPages, 'InicioPage'>,
  NativeStackScreenProps<HomeTabs>
>;

const InicioPage: FC<propsType> = (props: propsType) => {
  return (
    <>
      <HeaderComponent title={'DEAH App'} />

      <ScrollView style={{ padding: 13 }}>
        <View style={{ marginBottom: 13 }}>
          <CustomCardCrearRutinas />

          <CustomCardJugadores />

          <CustomCardHistorialRutinas />
        </View>
      </ScrollView>
    </>
  );
};

export default InicioPage;
