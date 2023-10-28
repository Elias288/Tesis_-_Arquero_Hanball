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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../utils/EstilosGlobales';
import CustomModal from './CustomModal.component';
import sortType from '../utils/sortType';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { RutinaType } from '../data/RutinasType';
import { InicioTabPages } from '../navigation/InicioTab';
import { useCustomBLE } from '../contexts/BLEProvider';
import { RutinaTabPages } from '../navigation/RutinasTab';

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
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sort === sortType.oldestFirst) {
      // Ordenar por fecha el más viejo
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return 0;
    }
  };

  if (rutinaList.length == 0) {
    return (
      <View style={styles.emptyRutinasBody}>
        <Text style={styles.emptyRutinasText}>
          Sin Rutinas {listRutinasRealizadas && 'Cargadas'}
        </Text>
      </View>
    );
  }

  if (simpleList) {
    return (
      <>
        {rutinaList.map((item) => (
          <RenderSimpleItem key={item.id.toString()} {...item} />
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
        <View style={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Borrar Rutina</Text>
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>Seguro que quiere eliminar esta Rutina?</Text>
        </View>
      </CustomModal>
    </View>
  );
};

interface RenderProps {
  rutina: RutinaType;
  deleteRutina: (id: number) => void;
}
const RenderItem = (props: RenderProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<InicioTabPages>>();
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  const { rutina, deleteRutina } = props;

  const gotoJugar = () => {
    navigator?.navigate('Jugar', { rutina: JSON.stringify(rutina) });
  };

  return (
    <View style={styles.completeItemContainer}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="circle" size={50} color={GlobalStyles.greenBackColor} />
        <Text style={{ position: 'absolute', color: GlobalStyles.white }}>{rutina.id}</Text>
      </View>

      <Text style={styles.itemTitle}>{rutina.title}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'play'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={gotoJugar}
          disabled={!espConnectedStatus || !BLEPowerStatus}
        />
        <IconButton
          icon={'application-edit'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => alert('no implementado')}
        />
        <IconButton
          icon={'delete'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => deleteRutina(rutina.id)}
        />
      </View>
    </View>
  );
};

const RenderSimpleItem = (rutina: RutinaType) => {
  const navigator = useNavigation<NativeStackNavigationProp<RutinaTabPages>>();

  const goToViewRutina = () => {
    navigator.navigate('ViewRutina', { selectedId: rutina.id });
  };

  return (
    <TouchableOpacity style={styles.simpleItemContainer} onPress={goToViewRutina}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="circle" size={50} color={GlobalStyles.greenBackColor} />
        <Text style={{ position: 'absolute', color: GlobalStyles.white }}>{rutina.id}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{rutina.title}</Text>
      </View>
      <Text style={styles.simpleItemSubText}>
        {new Date(rutina.date).getDate() +
          '/' +
          new Date(rutina.date).getMonth() +
          '/' +
          new Date(rutina.date).getFullYear() +
          ': ' +
          new Date(rutina.date).getHours() +
          ':' +
          new Date(rutina.date).getMinutes() +
          ':' +
          new Date(rutina.date).getSeconds()}
      </Text>
    </TouchableOpacity>
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
    marginLeft: 1,
  },
  itemIcon: {
    marginHorizontal: 5,
  },
  emptyRutinasBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRutinasText: {
    color: '#aaaaaa',
    fontSize: 30,
    fontWeight: '500',
  },
});

export default ListarRutinasComponent;
