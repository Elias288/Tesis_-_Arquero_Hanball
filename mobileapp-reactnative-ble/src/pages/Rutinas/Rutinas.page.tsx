import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../../components/Header.component';
import { Button, IconButton } from 'react-native-paper';

import { RutinaTabPages } from '../../navigation/RutinasTab';
import ListarRutinasComponent from '../../components/ListarRutinas/ListarRutinas.component';
import CrearRutina from './CrearRutina.component';
import GlobalStyles from '../../utils/EstilosGlobales';

type propsType = NativeStackScreenProps<RutinaTabPages, 'RutinasPage'>;

const RutinasPage = (props: propsType) => {
  const { navigation, route } = props;
  const [visibleModal, setVisibleModal] = useState(false);

  const goToRutinasRealizadas = () => {
    navigation.navigate('RutinasRealizadas');
  };

  return (
    <>
      <HeaderComponent title={'Rutinas'} showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.action}>
          <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={[GlobalStyles.buttonStyle, { flex: 1 }]}
            disabled={true}
          >
            Ver Rutinas
          </Button>

          <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={[GlobalStyles.buttonStyle, { flex: 2 }]}
            onPress={goToRutinasRealizadas}
          >
            Ver Rutinas realizadas
          </Button>
        </View>

        <View style={{ flex: 1 }}>
          <ListarRutinasComponent />
        </View>

        <CrearRutina isVisible={visibleModal} hideModal={() => setVisibleModal(false)} />

        <IconButton
          icon={'plus'}
          mode="contained"
          containerColor={GlobalStyles.yellowBackColor}
          iconColor={GlobalStyles.white}
          size={40}
          style={{ position: 'absolute', right: 20, bottom: 20 }}
          onPress={() => setVisibleModal(true)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GlobalStyles.grayBackground, padding: 20 },
  action: {
    backgroundColor: GlobalStyles.white,
    marginBottom: 10,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
  },
});

export default RutinasPage;
