import { FlatList, Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { secuenciaType } from '../../../data/RutinasType';
import GlobalStyles from '../../../utils/EstilosGlobales';
import { IconButton } from 'react-native-paper';

interface ViewSecuenciasProps {
  secuencias: Array<secuenciaType>;
  listStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  viewResult?: boolean;
  edit: (secuencia: secuenciaType) => void;
  deleteSecuencia: (secuenciaId: string) => void;
}

const EditListaSecuenciaComponent: FC<ViewSecuenciasProps> = (props: ViewSecuenciasProps) => {
  const { secuencias, listStyle, itemStyle, viewResult, deleteSecuencia, edit } = props;

  return (
    <View style={listStyle}>
      <FlatList
        data={secuencias}
        renderItem={({ item }) => (
          <RenderItem
            secuencia={item}
            itemStyle={itemStyle}
            viewResult={viewResult}
            editSecuencia={edit}
            deleteSecuencia={deleteSecuencia}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

type renderItempProps = {
  secuencia: secuenciaType;
  itemStyle?: StyleProp<ViewStyle>;
  viewResult?: boolean;
  editSecuencia: (secuencia: secuenciaType) => void;
  deleteSecuencia: (secuenciaId: string) => void;
};

const RenderItem: FC<renderItempProps> = (props) => {
  const { secuencia, itemStyle, viewResult, editSecuencia, deleteSecuencia } = props;

  const editSec = () => {
    editSecuencia({ id: secuencia.id, ledId: secuencia.ledId, time: secuencia.time });
  };

  const dropSecuencia = () => {
    deleteSecuencia(secuencia.id);
  };

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
            <Text style={styles.itemTimeText}>{secuencia.time.toString()}s</Text>
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
            { marginRight: 5, backgroundColor: GlobalStyles.blueBackgroudn },
            itemStyle,
          ]}
        >
          <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
          <Text style={styles.itemTimeText}>{secuencia.time.toString()}s</Text>
        </View>

        {editSecuencia !== undefined && (
          <View
            style={{
              marginLeft: 10,
              paddingHorizontal: 10,
              borderLeftWidth: 1,
            }}
          >
            <View
              style={{
                backgroundColor: GlobalStyles.grayBackground,
                borderRadius: 30,
                flexDirection: 'row',
              }}
            >
              <IconButton
                icon={'pencil'}
                size={30}
                iconColor={GlobalStyles.black}
                onPress={editSec}
              />
              <IconButton
                icon={'delete'}
                size={30}
                iconColor={GlobalStyles.black}
                onPress={dropSecuencia}
              />
            </View>
          </View>
        )}
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

export default EditListaSecuenciaComponent;
