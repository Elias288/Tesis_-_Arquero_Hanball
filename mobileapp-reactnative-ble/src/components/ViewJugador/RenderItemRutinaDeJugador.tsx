import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import { RutinaType } from '../../data/RutinasType';
import { RootTabs } from '../../Main';
import { useNavigation } from '@react-navigation/native';
import formateDate from '../../utils/formateDate';

export const RenderItemRutinaDeJugador = ({ rutina }: { rutina: RutinaType }) => {
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();

  const goToViewRutina = () => {
    navigator.navigate('Rutinas', {
      screen: 'ViewRutina',
      params: { rutinaId: rutina.id, isRutinaResultado: true },
    });
  };

  return (
    <TouchableOpacity style={renderItemStyles.itemContainer} onPress={goToViewRutina}>
      <View style={renderItemStyles.infoContainer}>
        <Text style={renderItemStyles.itemTitle}>{rutina.title}</Text>
        <Text>{formateDate(new Date(rutina.createDate), true)}</Text>
      </View>

      <View style={renderItemStyles.countContainer}>
        <Text style={renderItemStyles.countText}>Tamaño de rutina: {rutina.secuencia.length}</Text>
        <Text style={renderItemStyles.countText}>
          Tiempo total:
          {rutina.secuencia.reduce(
            (acumuladorSecuencias, secuencia) => acumuladorSecuencias + secuencia.time,
            0
          )}
          s
        </Text>
        <Text style={[renderItemStyles.countText, { width: 'auto' }]}>
          Suma de tiempo realizados:{' '}
          {rutina.secuencia.reduce((acumuladorSecuencias, secuencia) => {
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
    // marginTop: 5,
    padding: 5,
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    height: '100%',
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
