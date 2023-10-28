import React, { FC, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { JugadorType } from '../data/JugadoresType';
import { IconButton } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../utils/EstilosGlobales';
import sortType from '../utils/sortType';
import CustomModal, { customModalStyles } from './CustomModal.component';
import { ListaJugadoresTabPages } from '../navigation/ListaJugadoresTab';
import { RootTabs } from '../Main';
import formateDate from '../utils/formateDate';

const ItemHeigth = 80;

interface ListarJugadoresProps {
  isSimpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  navigation?: NativeStackNavigationProp<RootTabs>;
  sort?: number;
}

const ListarJugadoresComponent: FC<ListarJugadoresProps> = (props) => {
  const { isSimpleList, cantRenderItems, containerStyle, sort, navigation } = props;
  const navigator = useNavigation<NativeStackNavigationProp<ListaJugadoresTabPages>>();

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

  const gotoViewJugadores = (jugadorId: number) => {
    if (navigation) {
      navigation.navigate('Jugadores', { screen: 'ViewJugadores', params: { jugadorId } });
      return;
    }

    navigator.navigate('ViewJugadores', { jugadorId });
  };

  if (jugadoresList.length == 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListMessage}>Sin jugadores</Text>
      </View>
    );
  }

  if (isSimpleList) {
    return (
      <>
        {jugadoresList.map((jugador) => (
          <RenderSimpleItem
            key={jugador.id.toString()}
            jugador={jugador}
            gotoViewJugadores={gotoViewJugadores}
          />
        ))}
      </>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={jugadoresList}
        renderItem={({ item: jugador }) => (
          <RenderItem
            jugador={jugador}
            deleteJugador={() => showDeleteModal(jugador.id)}
            gotoViewJugadores={gotoViewJugadores}
          />
        )}
        keyExtractor={(jugador) => jugador.id.toString()}
        ListFooterComponent={<View style={{ height: ItemHeigth - 30 }}></View>} // agrega un espacio en blanco al final
      />

      <CustomModal
        hideModal={() => setIsModalVisible(false)}
        onAceptar={deleteJugador}
        isVisible={isModalVisible}
        isAcceptCancel={true}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Jugador</Text>
        <Text style={customModalStyles.modalMessage}>Seguro que quiere eliminar este jugador?</Text>
      </CustomModal>
    </View>
  );
};

interface RenderProps {
  jugador: JugadorType;
  gotoViewJugadores: (jugadorId: number) => void;
  deleteJugador: (id: number) => void;
}

const RenderItem = ({ jugador, deleteJugador, gotoViewJugadores }: RenderProps) => {
  return (
    <View style={styles.completeItemContainer}>
      <Text style={{ flex: 1, fontSize: 18 }}>{jugador.name}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'eye'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => gotoViewJugadores(jugador.id)}
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

const RenderSimpleItem = ({
  jugador,
  gotoViewJugadores,
}: {
  jugador: JugadorType;
  gotoViewJugadores: (jugadorId: number) => void;
}) => {
  const goToViewJugador = () => {
    gotoViewJugadores(jugador.id);
  };

  return (
    <TouchableOpacity style={styles.simpleItemContainer} onPress={goToViewJugador}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{jugador.name}</Text>
      </View>
      <Text style={styles.simpleItemSubText}>{formateDate(new Date(jugador.date), false)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 13,
  },
  completeItemContainer: {
    backgroundColor: GlobalStyles.white,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 13,
  },
  simpleItemContainer: {
    backgroundColor: GlobalStyles.grayBackground,
    padding: 10,
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
