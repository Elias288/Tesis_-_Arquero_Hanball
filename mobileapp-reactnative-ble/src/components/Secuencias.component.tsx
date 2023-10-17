import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SecuenciaType, ListaSecuencias } from '../data/Secuencias.data';
import { IconButton } from 'react-native-paper';

const ItemHeigth = 80;

interface ListarSecuenciasProps {
  simpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  navigation?: any; // permite que el componente navegue
}

const ListarSecuenciasComponent: FC<ListarSecuenciasProps> = (props) => {
  const { simpleList, cantRenderItems, containerStyle, navigation } = props;
  const [listMode, setListMode] = useState<boolean>(false);
  const [secuenciasList, setSecuenciasList] = useState<Array<SecuenciaType>>([]);

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== simpleList) {
      setListMode(simpleList || false);
    }

    // carga todos los jugadores
    setSecuenciasList(ListaSecuencias);

    // si cantRenderItems está definido
    if (cantRenderItems) {
      setSecuenciasList(ListaSecuencias.slice(0, cantRenderItems));
    }
  }, []);

  const RenderItem: FC<SecuenciaType> = ({ title, id }) => {
    return (
      <View style={styles.completeItemContainer}>
        <View>
          <Icon name="circle" size={50} color="#3CB371" />
        </View>

        <Text style={styles.itemTitle}>{title}</Text>

        {/******************************************* Options *******************************************/}
        <View style={styles.itemIcon}>
          <TouchableOpacity>
            <Icon name="application-edit-outline" size={30} color="#3CB371" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemIcon}>
          <TouchableOpacity>
            <Icon name="trash-can" size={30} color="#3CB371" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RenderSimpleItem: FC<SecuenciaType> = ({ title, id }) => {
    return (
      <View style={styles.simpleItemContainer}>
        <View>
          <Icon name="circle" size={50} color="#3CB371" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.simpleItemSubText}>
            * Info relevante del jugador (horas de entrenamiento, cantidad de rutinas, etc)
          </Text>
        </View>
        <Text style={styles.simpleItemSubText}>fecha</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {simpleList ? (
        // lista simple
        <>
          {secuenciasList.map((item) => (
            <RenderSimpleItem key={item.id.toString()} {...item} />
          ))}
        </>
      ) : (
        // lista completa
        <FlatList
          data={secuenciasList}
          renderItem={({ item }) => <RenderItem {...item} />}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={<View style={{ height: ItemHeigth - 30 }}></View>} // agrega un espacio en blanco al final
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 13,
  },
  completeItemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: ItemHeigth,
    marginHorizontal: 25,
    marginBottom: 13,
  },
  simpleItemContainer: {
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 13,
  },
  simpleItemSubText: {
    fontSize: 13,
  },
  itemTitle: {
    flex: 4,
    fontSize: 18,
    marginLeft: 1,
  },
  itemIcon: {
    marginHorizontal: 5,
  },
});

export default ListarSecuenciasComponent;
