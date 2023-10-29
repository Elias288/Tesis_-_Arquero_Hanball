import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import GlobalStyles from '../../utils/EstilosGlobales';
import CustomModal, { customModalStyles } from '../CustomModal.component';
import sortType from '../../utils/sortType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { RutinaType } from '../../data/RutinasType';
import { RenderSimpleItem } from './RenderSimpleItem';
import { RenderItem } from './RenderItem';
import { RenderItemRutinaDeJugador } from '../../pages/Jugadores/ViewJugador/RenderItemRutinaDeJugador';

const ItemHeigth = 80;

interface ListarRutinasProps {
  simpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  listRutinasRealizadas?: boolean; // permite que el componente navegue
  sort?: number;
}

const ListarRutinasComponent: FC<ListarRutinasProps> = (props) => {
  const { simpleList, cantRenderItems, containerStyle, listRutinasRealizadas, sort } = props;
  const {
    rutinas: storedRutinas,
    rutinasRealizadas: storedRutinasRealizadas,
    popRutina,
    popRutinaRealizada,
  } = useCustomLocalStorage();

  const [selectedRutinaId, setSelectedRutinaId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [listMode, setListMode] = useState<boolean>(false);
  const [rutinaList, setRutinaList] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== simpleList) {
      setListMode(simpleList || false);
    }

    // carga todas las rutinas
    if (listRutinasRealizadas) {
      setRutinaList(storedRutinasRealizadas.sort((a, b) => sortArray(a, b)));

      // si cantRenderItems está definido
      if (cantRenderItems) {
        setRutinaList(
          storedRutinasRealizadas.slice(0, cantRenderItems).sort((a, b) => sortArray(a, b))
        );
      }
      return;
    }

    setRutinaList(storedRutinas.sort((a, b) => sortArray(a, b)));

    if (cantRenderItems) {
      setRutinaList(storedRutinas.slice(0, cantRenderItems).sort((a, b) => sortArray(a, b)));
    }
  }, [storedRutinas, storedRutinasRealizadas]);

  const deleteRutina = () => {
    if (listRutinasRealizadas) {
      popRutinaRealizada(selectedRutinaId);
    } else popRutina(selectedRutinaId);
    setIsModalVisible(false);
  };

  const showDeleteModal = (rutinaId: number) => {
    setIsModalVisible(true);
    setSelectedRutinaId(rutinaId);
  };

  const sortArray = (a: RutinaType, b: RutinaType): number => {
    if (sort === undefined || sort === sortType.alphabetic) {
      // Ordenar por nombre
      return a.title.localeCompare(b.title);
    } else if (sort === sortType.newestFirst) {
      // Ordenar por fecha el más nuevo
      return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
    } else if (sort === sortType.oldestFirst) {
      // Ordenar por fecha el más viejo
      return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
    } else if (sort === sortType.lastplayed) {
      // Ordenar por fecha el más viejo
      if (!a.playedDate || !b.playedDate) return 0;

      return new Date(a.playedDate).getTime() - new Date(b.playedDate).getTime();
    } else {
      return 0;
    }
  };

  if (rutinaList.length == 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListMessage}>
          Sin Rutinas {listRutinasRealizadas && 'Cargadas'}
        </Text>
      </View>
    );
  }

  if (simpleList) {
    return (
      <>
        {rutinaList.map((item) => (
          <RenderSimpleItem
            key={item.id.toString()}
            rutina={item}
            isRutinaRealizada={listRutinasRealizadas || false}
          />
        ))}
      </>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* // lista completa */}
      <FlatList
        data={rutinaList}
        renderItem={({ item }) => (
          <RenderItem rutina={item} deleteRutina={() => showDeleteModal(item.id)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={<View style={{ height: ItemHeigth - 30 }}></View>} // agrega un espacio en blanco al final
      />
      <CustomModal
        hideModal={() => setIsModalVisible(false)}
        onAceptar={deleteRutina}
        isVisible={isModalVisible}
        isAcceptCancel={true}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Rutina</Text>
        <Text style={customModalStyles.modalMessage}>Seguro que quiere eliminar esta Rutina?</Text>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completeItemContainer: {
    backgroundColor: GlobalStyles.white,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  simpleItemContainer: {
    backgroundColor: GlobalStyles.white,
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
    marginHorizontal: 20,
  },
  itemIcon: {
    marginHorizontal: 5,
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

export default ListarRutinasComponent;
