import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InicioTabPages } from '../navigation/InicioTab';
import HeaderComponent from '../components/Header.component';
import { useCustomBLE } from '../contexts/BLEProvider';
import { secuenciaType } from '../data/RutinasType';
import ViewSecuenciaResultadoComponent from '../components/ViewSecuenciaResultado.component';
import { BLUETOOTHNOTCONNECTED } from '../utils/BleCodes';

type propsType = NativeStackScreenProps<InicioTabPages, 'ViewResult'>;

const ViewResultPage = (props: propsType) => {
  const { navigation, route } = props;
  const { res } = route.params;
  const { BLECode, selectedRutina, stringToSecuencia } = useCustomBLE();
  const [resultadoGame, setResultadoGame] = useState<Array<secuenciaType>>([]);

  useEffect(() => {
    setResultadoGame(stringToSecuencia(res));
  }, []);

  useEffect(() => {
    if (BLECode === BLUETOOTHNOTCONNECTED) {
      navigation.navigate('InicioPage');
    }
  }, [BLECode]);

  return (
    <>
      <HeaderComponent title="Ver resultado" showBackButton={true} />
      <View style={styles.container}>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={styles.title}>Jugador:</Text>
          <Text
            style={{
              backgroundColor: '#e7d84f',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              fontSize: 20,
            }}
          >
            {selectedRutina?.jugador}
          </Text>
        </View>

        <View>
          <Text style={styles.title}>Resultado:</Text>
          <ViewSecuenciaResultadoComponent secuencias={resultadoGame} />
        </View>
      </View>
    </>
  );
};

export default ViewResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
