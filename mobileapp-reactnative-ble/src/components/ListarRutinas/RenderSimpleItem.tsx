import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import formateDate from '../../utils/formateDate';
import { RutinaType } from '../../data/RutinasType';
import { RutinaTabPages } from '../../navigation/RutinasTab';
import { JugadorType } from '../../data/JugadoresType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';

type renderSimpleItemProps = {
  rutina: RutinaType;
};
export const RenderSimpleItem = ({ rutina }: renderSimpleItemProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<RutinaTabPages>>();

  const goToViewRutina = () => {
    navigator.navigate('ViewRutina', { rutinaTitulo: rutina.titulo });
  };

  return (
    <TouchableOpacity style={styles.simpleItemContainer} onPress={goToViewRutina}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="circle" size={50} color={GlobalStyles.greenBackColor} />
        <Text style={{ position: 'absolute', color: GlobalStyles.white }}>{rutina.titulo}</Text>
      </View>

      <View style={styles.simpleInfoContainer}>
        <Text style={styles.itemTitle}>{rutina.titulo}</Text>
      </View>

      <Text style={styles.simpleItemSubText}>
        {formateDate(new Date(rutina.fechaDeCreación), true)}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  simpleItemContainer: {
    backgroundColor: GlobalStyles.white,
    padding: 5,
    borderRadius: 5,
    marginBottom: 13,
    flexDirection: 'row',
  },
  simpleInfoContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  simpleItemSubText: {
    fontSize: 13,
    flex: 1,
  },
  itemTitle: {
    flex: 4,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
