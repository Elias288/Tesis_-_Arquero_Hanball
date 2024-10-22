import { FlatList, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import React, { FC } from 'react';
import { secuenciaType } from '../data/RutinasType';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyles from '../utils/EstilosGlobales';

interface ViewSecuenciasProps {
  secuencias: Array<secuenciaType>;
  listStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  viewResult?: boolean;
}

const ListarSecuenciaComponent: FC<ViewSecuenciasProps> = (props: ViewSecuenciasProps) => {
  const { secuencias, listStyle, itemStyle, viewResult } = props;

  return (
    <View style={listStyle}>
      <FlatList
        data={secuencias}
        renderItem={({ item }) => (
          <RenderItem secuencia={item} itemStyle={itemStyle} viewResult={viewResult} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

type renderItempProps = {
  secuencia: secuenciaType;
  itemStyle?: StyleProp<ViewStyle>;
  viewResult?: boolean;
};

const RenderItem: FC<renderItempProps> = ({ secuencia, itemStyle, viewResult }) => {
  const content = () => {
    if (viewResult) {
      return (
        <>
          <View
            style={[
              styles.itemCircle,
              { marginRight: 5, backgroundColor: GlobalStyles.greenBackColor },
            ]}
          >
            <Icon name="led-on" size={40} color={GlobalStyles.white} />
            <Text style={styles.itemLedText}>{secuencia.ledId}</Text>
          </View>

          <View style={[styles.itemCircle, { marginRight: 5, backgroundColor: '#536ac7' }]}>
            <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
            <Text style={styles.itemTimeText}>{secuencia.tiempo.toString()}s</Text>
          </View>

          <View style={[styles.itemCircle, { backgroundColor: '#536ac7' }]}>
            <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
            {secuencia.resTime != undefined && secuencia.resTime != '-' ? (
              <Text style={styles.itemTimeText}>{secuencia.resTime?.toString()}s</Text>
            ) : (
              <Text style={styles.itemTimeText}>Null</Text>
            )}
          </View>
        </>
      );
    }

    return (
      <>
        <View
          style={[
            styles.itemCircle,
            { marginRight: 5, backgroundColor: GlobalStyles.greenBackColor },
            itemStyle,
          ]}
        >
          <Icon name="led-on" size={40} color={GlobalStyles.white} />
          <Text style={styles.itemLedText}>{secuencia.ledId}</Text>
        </View>

        <View
          style={[
            styles.itemCircle,
            { marginRight: 5, backgroundColor: GlobalStyles.blueBackground },
            itemStyle,
          ]}
        >
          <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
          <Text style={styles.itemTimeText}>{secuencia.tiempo.toString()}s</Text>
        </View>
      </>
    );
  };

  return <View style={styles.itemContainer}>{content()}</View>;
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: GlobalStyles.white,
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
  itemEditButton: {
    marginRight: 5,
  },
});

export default ListarSecuenciaComponent;
