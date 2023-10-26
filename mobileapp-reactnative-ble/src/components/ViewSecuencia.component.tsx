import { FlatList, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import React, { FC } from 'react';
import { secuenciaType } from '../data/RutinasType';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ViewSecuenciasProps {
  secuencias: Array<secuenciaType>;
  listStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

const ViewSecuenciaComponent: FC<ViewSecuenciasProps> = (props: ViewSecuenciasProps) => {
  const { secuencias, listStyle, itemStyle } = props;
  return (
    <View style={listStyle}>
      <FlatList
        data={secuencias}
        renderItem={({ item }) => <RenderItem secuencia={item} itemStyle={itemStyle} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const RenderItem: FC<{ secuencia: secuenciaType; itemStyle?: StyleProp<ViewStyle> }> = ({
  secuencia,
  itemStyle,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={[styles.itemCircle, { marginRight: 5, backgroundColor: '#3CB371' }, itemStyle]}>
        <Icon name="led-on" size={40} color="#fff" />
        <Text style={styles.itemLedText}>{secuencia.ledId}</Text>
      </View>

      <View style={[styles.itemCircle, { backgroundColor: '#536ac7' }, itemStyle]}>
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
