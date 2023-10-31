import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { JugadorType } from '../../data/JugadoresType';
import { ListaJugadoresTabPages } from '../../navigation/ListaJugadoresTab';
import sortType from '../../utils/sortType';
import GlobalStyles from '../../utils/EstilosGlobales';
import CustomModal, { customModalStyles } from '../CustomModal.component';
import { RenderItem } from './RenderItem';
import { RenderSimpleItem } from './RenderSimpleItem';
import { HomeTabs } from '../../navigation/HomeTab';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';

interface ListarJugadoresProps {
  isSimpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  navigation?: NativeStackNavigationProp<HomeTabs>;
  sort?: number;
}

const ListarJugadoresComponent: FC<ListarJugadoresProps> = (props) => {
  const { isSimpleList, cantRenderItems, containerStyle, sort, navigation } = props;
  const navigator = useNavigation<NativeStackNavigationProp<ListaJugadoresTabPages>>();

  const { jugadores: localStoredJugadores, popJugador } = useCustomLocalStorage();

  // const [remoteJugadores, setRemoteJugadores] = useState<JugadorType[]>([]);
  const [listMode, setListMode] = useState<boolean>(false);
  const [jugadoresList, setJugadoresList] = useState<Array<JugadorType>>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedJugadorId, setSelectedJugadorId] = useState<string>('');

  const sortArray = (a: JugadorType, b: JugadorType): number => {
    if (sort === undefined || sort === sortType.alphabetic) {
      // Ordenar por nombre
      return a.nombre.localeCompare(b.nombre);
    } else if (sort === sortType.newestFirst) {
      // Ordenar por fecha el más nuevo
      return new Date(b.fechaCreación).getTime() - new Date(a.fechaCreación).getTime();
    } else if (sort === sortType.oldestFirst) {
      // Ordenar por fecha el más viejo
      return new Date(a.fechaCreación).getTime() - new Date(b.fechaCreación).getTime();
    } else {
      return 0;
    }
  };

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== isSimpleList) {
      setListMode(isSimpleList || false);
    }

    // if (isWifiConnected) {
      // carga todos los jugadores en la bd
      // if (remoteJugadores !== undefined)
      //   setJugadoresList(remoteJugadores /* .sort((a, b) => sortArray(a, b)) */);
    // } else {
      // carga todos los jugadores
      setJugadoresList(localStoredJugadores.sort((a, b) => sortArray(a, b)));
    // }

    // si cantRenderItems está definido
    if (cantRenderItems) {
      setJugadoresList(
        localStoredJugadores.slice(0, cantRenderItems).sort((a, b) => sortArray(a, b))
      );
    }
  }, [localStoredJugadores]);

  const deleteJugador = () => {
    popJugador(selectedJugadorId);
    setIsModalVisible(false);
  };

  const showDeleteModal = (jugadorId: string) => {
    setIsModalVisible(true);
    setSelectedJugadorId(jugadorId);
  };

  const gotoViewJugadores = (jugadorId: string) => {
    if (navigation) {
      navigation.navigate('Jugadores', { screen: 'ViewJugadores', params: { jugadorId } });
      return;
    }

    navigator.navigate('ViewJugadores', { jugadorId });
  };

  if (jugadoresList.length == 0) {
    return (
      <View style={listarJugadoresStyles.emptyListContainer}>
        <Text style={listarJugadoresStyles.emptyListMessage}>Sin jugadores</Text>
      </View>
    );
  }

  if (isSimpleList) {
    return (
      <>
        {jugadoresList.map((jugador) => (
          <RenderSimpleItem
            key={jugador._id}
            jugador={jugador}
            gotoViewJugadores={gotoViewJugadores}
          />
        ))}
      </>
    );
  }

  return (
    <View style={[listarJugadoresStyles.container, containerStyle]}>
      <FlatList
        data={jugadoresList}
        renderItem={({ item: jugador }) => (
          <RenderItem
            jugador={jugador}
            deleteJugador={() => showDeleteModal(jugador._id)}
            gotoViewJugadores={gotoViewJugadores}
          />
        )}
        keyExtractor={(jugador) => jugador._id.toString()}
        contentContainerStyle={listarJugadoresStyles.scrollStyle}
      />

      <CustomModal
        hideModal={() => setIsModalVisible(false)}
        onAceptar={deleteJugador}
        isVisible={isModalVisible}
        isAcceptCancel={true}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Jugador</Text>
        <View style={customModalStyles.modalMessage}>
          <Text>Seguro que quiere eliminar este jugador?</Text>
          <Text>Se eliminarán sus rutinas realizadas tambien</Text>
        </View>
      </CustomModal>
    </View>
  );
};

const listarJugadoresStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollStyle: {
    paddingBottom: 100,
    paddingTop: 13,
    paddingHorizontal: 13,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListMessage: {
    color: GlobalStyles.grayText,
    fontSize: 30,
    fontWeight: '500',
  },
});

export default ListarJugadoresComponent;
