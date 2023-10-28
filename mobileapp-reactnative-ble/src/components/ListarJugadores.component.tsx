import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { JugadorType } from '../data/JugadoresType';
import { IconButton } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InicioTabPages } from '../navigation/InicioTab';
import CustomModal, { customModalStyles } from './CustomModal.component';
import GlobalStyles from '../utils/EstilosGlobales';
import sortType from '../utils/sortType';

const ItemHeigth = 80;

interface ListarJugadoresProps {
  isSimpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  sort?: number;
}

const ListarJugadoresComponent: FC<ListarJugadoresProps> = (props) => {
  const { isSimpleList, cantRenderItems, containerStyle, sort } = props;

  const [listMode, setListMode] = useState<boolean>(false);
  const { jugadores: storedJugadores, popJugador } = useCustomLocalStorage();
  const [jugadoresList, setJugadoresList] = useState<Array<JugadorType>>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedJugadorId, setSelectedJugadorId] = useState<number>(0);

  const sortArray = (a: JugadorType, b: JugadorType): number => {
    if (sort === undefined || sort === sortType.alphabetic) {
      // Ordenar por nombre
      return a.name.localeCompare(b.name);
    } else if (sort === sortType.newestFirst) {
      // Ordenar por fecha el más nuevo
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sort === sortType.oldestFirst) {
      // Ordenar por fecha el más viejo
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return 0;
    }
  };

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== isSimpleList) {
      setListMode(isSimpleList || false);
    }

    // carga todos los jugadores
    setJugadoresList(storedJugadores.sort((a, b) => sortArray(a, b)));

    // si cantRenderItems está definido
    if (cantRenderItems) {
      setJugadoresList(storedJugadores.slice(0, cantRenderItems).sort((a, b) => sortArray(a, b)));
    }
  }, [storedJugadores]);

  const deleteJugador = () => {
    popJugador(selectedJugadorId);
    setIsModalVisible(false);
  };

  const showDeleteModal = (jugadorId: number) => {
    setIsModalVisible(true);
    setSelectedJugadorId(jugadorId);
  };

  if (jugadoresList.length == 0) {
    return (
      <View style={styles.emptyJugadoresBody}>
        <Text style={styles.emptyJugadoresText}>Sin jugadores</Text>
      </View>
    );
  }

  if (isSimpleList) {
    return (
      <>
        {jugadoresList.map((jugador) => (
          <RenderSimpleItem key={jugador.id.toString()} jugador={jugador} />
        ))}
      </>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <CustomModal
        hideModal={() => setIsModalVisible(false)}
        onAceptar={deleteJugador}
        isVisible={isModalVisible}
        isAcceptCancel={true}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Jugador</Text>
        <Text style={customModalStyles.modalMessage}>Seguro que quiere eliminar este jugador?</Text>
      </CustomModal>

      <FlatList
        data={jugadoresList}
        renderItem={({ item: jugador }) => (
          <RenderItem jugador={jugador} deleteJugador={() => showDeleteModal(jugador.id)} />
        )}
        keyExtractor={(jugador) => jugador.id.toString()}
        ListFooterComponent={<View style={{ height: ItemHeigth - 30 }}></View>} // agrega un espacio en blanco al final
      />
    </View>
  );
};

interface RenderProps {
  jugador: JugadorType;
  deleteJugador: (id: number) => void;
}

const RenderItem = ({ jugador, deleteJugador }: RenderProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<InicioTabPages>>();

  const gotoHist_Jugadores = (nomJug: string) => {
    navigator.navigate('Hist_Jugadores', { name: nomJug });
  };

  return (
    <View style={styles.completeItemContainer}>
      <View style={styles.jugadorImage}></View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.jugadorName}>{jugador.name}</Text>
      </View>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'account-edit'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          mode="contained"
          onPress={() => alert('no implementado')}
        />
        <IconButton
          icon={'clipboard-text-outline'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => gotoHist_Jugadores(jugador.name)}
          mode="contained"
        />
        <IconButton
          icon={'delete'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => deleteJugador(jugador.id)}
          mode="contained"
        />
      </View>
    </View>
  );
};

const RenderSimpleItem = ({ jugador }: { jugador: JugadorType }) => {
  return (
    <View style={styles.simpleItemContainer}>
      <View>
        <Icon name="circle" size={50} color={GlobalStyles.greenBackColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{jugador.name}</Text>
      </View>
      <Text style={styles.simpleItemSubText}>
        {new Date(jugador.date).getDate() +
          '/' +
          new Date(jugador.date).getMonth() +
          '/' +
          new Date(jugador.date).getFullYear()}
      </Text>
      {/* <Text style={styles.simpleItemSubText}>{jugador.date.toString()}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 13,
  },
  completeItemContainer: {
    backgroundColor: GlobalStyles.white,
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
  jugadorName: { fontSize: 18 },
  jugadorImage: {
    backgroundColor: GlobalStyles.greenBackColor,
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  emptyJugadoresBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyJugadoresText: {
    color: GlobalStyles.grayText,
    fontSize: 30,
    fontWeight: '500',
  },
});

export default ListarJugadoresComponent;
