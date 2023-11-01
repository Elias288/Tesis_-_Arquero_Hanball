import React, { FC } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import CustomCardHistorialRutinas from './CustomCardHistorialRutinas';
import CustomCardCrearRutinas from './CustomCardCrearRutinas';
import CustomCardJugadores from './CustomCardJugadores';
import GlobalStyles from '../../utils/EstilosGlobales';

import { inicioTabPages } from '../../navigation/InicioTab';
import { HomeTabs } from '../../navigation/HomeTab';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../../components/Header/Header.component';

type propsType = CompositeScreenProps<
  NativeStackScreenProps<inicioTabPages, 'InicioPage'>,
  NativeStackScreenProps<HomeTabs>
>;

const InicioPage: FC<propsType> = (props: propsType) => {
  return (
    <View style={styles.container}>
      <HeaderComponent title={'DEAH App'} />

      <ScrollView contentContainerStyle={styles.scrollStyles}>
        <View>
          <CustomCardCrearRutinas />

          <CustomCardJugadores />

          <CustomCardHistorialRutinas />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.grayBackground,
    flex: 1,
  },
  scrollStyles: {
    paddingTop: 13,
    paddingHorizontal: 13,
  },
});
export default InicioPage;
