import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import GlobalStyles from '../../utils/EstilosGlobales';
import CustomModal, { customModalStyles } from '../CustomModal.component';
import sortType from '../../utils/sortType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { ResultadoType } from '../../data/ResultadoType';
import { RenderSimpleRutinaRealizada } from './RenderSimpleResultado';

interface ListarRutinasProps {
  simpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  sort?: number;
}

const ListarRutinasRealizadasComponent: FC<ListarRutinasProps> = (props) => {
  const { simpleList, cantRenderItems, containerStyle, sort } = props;
  const {
    rutinas: storedRutinas,
    rutinasRealizadas: storedRutinasRealizadas,
    popRutinaRealizada,
  } = useCustomLocalStorage();

  const [selectedRutinaId, setSelectedRutinaId] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [listMode, setListMode] = useState<boolean>(false);
  const [rutinaList, setRutinaList] = useState<Array<ResultadoType>>([]);

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== simpleList) {
      setListMode(simpleList || false);
    }

    // carga todas las rutinas
    setRutinaList(storedRutinasRealizadas.sort((a, b) => sortResultados(a, b)));

    // si cantRenderItems está definido
    if (cantRenderItems) {
      setRutinaList(
        storedRutinasRealizadas.slice(0, cantRenderItems).sort((a, b) => sortResultados(a, b))
      );
    }
  }, [storedRutinas, storedRutinasRealizadas]);

  const deleteRutina = () => {
    popRutinaRealizada(selectedRutinaId);
    setIsModalVisible(false);
  };

  const sortResultados = (a: ResultadoType, b: ResultadoType): number => {
    if (sort === undefined || sort === sortType.alphabetic) {
      return a.titulo.localeCompare(b.titulo);
    } else if (sort === sortType.newestFirst) {
      return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
    } else if (sort === sortType.oldestFirst) {
      return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
    } else if (sort === sortType.lastplayedFirst) {
      return new Date(b.playedDate).getTime() - new Date(a.playedDate).getTime();
    }

    return 0;
  };

  if (rutinaList.length == 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListMessage}>Sin Rutinas</Text>
      </View>
    );
  }

  if (simpleList) {
    return (
      <>
        {rutinaList.sort().map((item, index) => (
          <RenderSimpleRutinaRealizada rutina={item} index={index + 1} key={item._id} />
        ))}
      </>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* // lista completa */}
      {/* <FlatList
        data={rutinaList}
        renderItem={({ item }) => (
          <RenderItem rutina={item} deleteRutina={() => showDeleteModal(item._id)} />
        )}
        contentContainerStyle={styles.flatStyle}
        keyExtractor={(item) => item._id}
      /> */}
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

export default ListarRutinasRealizadasComponent;
