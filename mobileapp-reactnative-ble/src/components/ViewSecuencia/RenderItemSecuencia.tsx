import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { secuenciaType } from '../../data/RutinasType';
import GlobalStyles from '../../utils/EstilosGlobales';

export const RenderItemSecuencia = ({ secuenciaRes }: { secuenciaRes: secuenciaType }) => {
  return (
    <View style={ViewSecuenciaResultadoStyles.itemContainer}>
      <View
        style={[
          ViewSecuenciaResultadoStyles.itemCircle,
          { marginRight: 5, backgroundColor: GlobalStyles.greenBackColor },
        ]}
      >
        <Icon name="led-on" size={40} color={GlobalStyles.white} />
        <Text style={ViewSecuenciaResultadoStyles.itemLedText}>{secuenciaRes.ledId}</Text>
      </View>

      <View
        style={[
          ViewSecuenciaResultadoStyles.itemCircle,
          { marginRight: 5, backgroundColor: '#536ac7' },
        ]}
      >
        <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
        <Text style={ViewSecuenciaResultadoStyles.itemTimeText}>
          {secuenciaRes.tiempo.toString()}s
        </Text>
      </View>

      <View style={[ViewSecuenciaResultadoStyles.itemCircle, { backgroundColor: '#536ac7' }]}>
        <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
        {secuenciaRes.resTime != undefined && secuenciaRes.resTime != '-' ? (
          <Text style={ViewSecuenciaResultadoStyles.itemTimeText}>
            {secuenciaRes.resTime?.toString()}s
          </Text>
        ) : (
          <Text style={ViewSecuenciaResultadoStyles.itemTimeText}>Null</Text>
        )}
      </View>
    </View>
  );
};

const ViewSecuenciaResultadoStyles = StyleSheet.create({
  itemContainer: {
    backgroundColor: GlobalStyles.white,
    borderRadius: 15,
    padding: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCircle: {
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemLedText: {
    color: GlobalStyles.greenBackColor,
    fontWeight: 'bold',
    fontSize: 20,
    position: 'absolute',
  },
  itemTimeText: {
    color: GlobalStyles.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
