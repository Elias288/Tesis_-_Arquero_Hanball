import { FlatList, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import React, { FC } from 'react';
import { secuenciaType } from '../data/ListaRutinas.data';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ViewSecuenciasProps {
  secuencias: Array<secuenciaType>;
  style?: StyleProp<ViewStyle>;
}

const ViewSecuenciaComponent: FC<ViewSecuenciasProps> = ({ secuencias, style }) => {
  return (
    <View style={style}>
      <FlatList
        data={secuencias}
        renderItem={({ item }) => <RenderItem secuencia={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const RenderItem: FC<{ secuencia: secuenciaType }> = ({ secuencia }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={[styles.itemCircle, { marginRight: 5, backgroundColor: '#3CB371' }]}>
        <Icon name="led-on" size={40} color="#fff" />
        <Text style={styles.itemLedText}>{secuencia.ledId}</Text>
      </View>

      <View style={[styles.itemCircle, { backgroundColor: '#536ac7' }]}>
        <Icon name="timer-sand-complete" size={40} color="#fff" />
        <Text style={styles.itemTimeText}>{secuencia.time.toString()}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default ViewSecuenciaComponent;
