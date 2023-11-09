import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import GlobalStyles from '../../utils/EstilosGlobales';
import CustomModal, { customModalStyles } from '../CustomModal.component';
import sortType from '../../utils/sortType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { RutinaType } from '../../data/RutinasType';
import { RenderSimpleItem } from './RenderSimpleItem';
import { RenderItem } from './RenderItem';

interface ListarRutinasProps {
  simpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  sort?: number;
}

const ListarRutinasComponent: FC<ListarRutinasProps> = (props) => {
  const { simpleList, cantRenderItems, containerStyle, sort } = props;
  const {
    rutinas: storedRutinas,
    rutinasRealizadas: storedRutinasRealizadas,
    popRutina,
    popRutinaRealizada,
  } = useCustomLocalStorage();

  const [selectedRutinaId, setSelectedRutinaId] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [listMode, setListMode] = useState<boolean>(false);
  const [rutinaList, setRutinaList] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== simpleList) {
      setListMode(simpleList || false);
    }

    setRutinaList(storedRutinas.sort((a, b) => sortRutinas(a, b)));

    if (cantRenderItems) {
      setRutinaList(storedRutinas.slice(0, cantRenderItems).sort((a, b) => sortRutinas(a, b)));
    }
  }, [storedRutinas, storedRutinasRealizadas]);

  const deleteRutina = () => {
    popRutina(selectedRutinaId);
    setIsModalVisible(false);
  };

  const showDeleteModal = (rutinaId: string) => {
    setIsModalVisible(true);
    setSelectedRutinaId(rutinaId);
  };

  const sortRutinas = (a: RutinaType, b: RutinaType): number => {
    if (sort === undefined || sort === sortType.alphabetic) {
      // Ordenar por nombre
      return a.titulo.localeCompare(b.titulo);
    } else if (sort === sortType.newestFirst) {
      // Ordenar por fecha el más nuevo
      return new Date(b.fechaDeCreación).getTime() - new Date(a.fechaDeCreación).getTime();
    } else if (sort === sortType.oldestFirst) {
      // Ordenar por fecha el más viejo
      return new Date(a.fechaDeCreación).getTime() - new Date(b.fechaDeCreación).getTime();
    } else {
      return 0;
    }
  };

  if (rutinaList.length == 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListMessage}>Sin Rutinas Cargadas</Text>
      </View>
    );
  }

  if (simpleList) {
    return (
      <>
        {rutinaList.map((item) => (
          <RenderSimpleItem key={item.titulo} rutina={item} />
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
          <RenderItem rutina={item} deleteRutina={() => showDeleteModal(item.titulo)} />
        )}
        contentContainerStyle={styles.flatStyle}
        keyExtractor={(item) => item.titulo}
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
  flatStyle: {
    paddingBottom: 100,
    paddingHorizontal: 13,
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
