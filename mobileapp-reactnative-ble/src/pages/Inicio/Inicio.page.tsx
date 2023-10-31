import React, { FC } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import CustomCardHistorialRutinas from './CustomCardHistorialRutinas';
import CustomCardCrearRutinas from './CustomCardCrearRutinas';
import CustomCardJugadores from './CustomCardJugadores';
import GlobalStyles from '../../utils/EstilosGlobales';
import HeaderComponent from '../../components/Header/Header.component';

const InicioPage: FC = () => {
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
