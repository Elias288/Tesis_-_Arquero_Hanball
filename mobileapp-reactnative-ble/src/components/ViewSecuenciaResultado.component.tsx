import { FlatList, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { secuenciaType } from '../data/RutinasType';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ViewSecuenciasResProps {
  secuencias: Array<secuenciaType>;
  style?: StyleProp<ViewStyle>;
}
const ViewSecuenciaResultadoComponent: FC<ViewSecuenciasResProps> = ({ secuencias, style }) => {
  return (
    <View style={style}>
      <FlatList
        data={secuencias}
        renderItem={({ item }) => <RenderItem secuenciaRes={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const RenderItem: FC<{ secuenciaRes: secuenciaType }> = ({ secuenciaRes }) => {
  return (
    <View style={ViewSecuenciaResultadoStyles.itemContainer}>
      <View
        style={[
          ViewSecuenciaResultadoStyles.itemCircle,
          { marginRight: 5, backgroundColor: '#3CB371' },
        ]}
      >
        <Icon name="led-on" size={40} color="#fff" />
        <Text style={ViewSecuenciaResultadoStyles.itemLedText}>{secuenciaRes.ledId}</Text>
      </View>

      <View
        style={[
          ViewSecuenciaResultadoStyles.itemCircle,
          { marginRight: 5, backgroundColor: '#536ac7' },
        ]}
      >
        <Icon name="timer-sand-complete" size={40} color="#fff" />
        <Text style={ViewSecuenciaResultadoStyles.itemTimeText}>
          {secuenciaRes.time.toString()}s
        </Text>
      </View>

      <View style={[ViewSecuenciaResultadoStyles.itemCircle, { backgroundColor: '#536ac7' }]}>
        <Icon name="timer-sand-complete" size={40} color="#fff" />
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
    backgroundColor: '#fff',
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
    color: '#3CB371',
    fontWeight: 'bold',
    fontSize: 20,
    position: 'absolute',
  },
  itemTimeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ViewSecuenciaResultadoComponent;
