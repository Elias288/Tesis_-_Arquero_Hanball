import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import { useNavigation } from '@react-navigation/native';
import formateDate from '../../utils/formateDate';
import { HomeTabs } from '../../navigation/HomeTab';
import { ResultadoType } from '../../data/ResultadoType';

export const RenderItemRutinaDeJugador = ({ rutina }: { rutina: ResultadoType }) => {
  const navigator = useNavigation<NativeStackNavigationProp<HomeTabs>>();

  const goToViewRutina = () => {
    navigator.navigate('Rutinas', {
      screen: 'ViewRutinaResultado',
      params: { rutina: JSON.stringify(rutina) },
    });
  };

  return (
    <TouchableOpacity style={renderItemStyles.itemContainer} onPress={goToViewRutina}>
      <View style={renderItemStyles.infoContainer}>
        <Text style={renderItemStyles.itemTitle}>{rutina.titulo}</Text>
        <Text>{formateDate(new Date(rutina.playedDate), true)}</Text>
      </View>

      <View style={renderItemStyles.countContainer}>
        <Text style={renderItemStyles.countText}>N° Secuencias: {rutina.secuencias.length}</Text>
        <Text style={renderItemStyles.countText}>
          Tiempo total:
          {rutina.secuencias.reduce(
            (acumuladorSecuencias, secuencia) => acumuladorSecuencias + secuencia.tiempo,
            0
          )}
          s
        </Text>
        <Text style={[renderItemStyles.countText, { width: 'auto' }]}>
          Suma de tiempo realizados:{' '}
          {rutina.secuencias.reduce((acumuladorSecuencias, secuencia) => {
            if (typeof secuencia.resTime == 'number') {
              return acumuladorSecuencias + secuencia.resTime;
            }
            return 0;
          }, 0)}
          s
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const renderItemStyles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    backgroundColor: GlobalStyles.grayBackground,
    padding: 10,
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  countContainer: {
    padding: 5,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  countText: {
    width: '45%',
    marginBottom: 5,
  },
  itemTitle: {
    flex: 4,
    fontSize: 18,
  },
});
