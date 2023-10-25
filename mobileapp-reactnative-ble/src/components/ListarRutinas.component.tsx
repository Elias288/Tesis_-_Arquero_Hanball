import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RutinaType } from '../data/RutinasType';
import { IconButton } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import CustomModal from './CustomModal.component';

const ItemHeigth = 80;

interface ListarRutinasProps {
  simpleList?: boolean; // muestra un lista sin opciones
  cantRenderItems?: number; // renderiza el número de items
  containerStyle?: StyleProp<ViewStyle>; // estilo personalizado del componente
  navigation?: any; // permite que el componente navegue
}

const ListarRutinasComponent: FC<ListarRutinasProps> = (props) => {
  const { simpleList, cantRenderItems, containerStyle, navigation } = props;
  const { rutinas: storedRutinas, popRutina } = useCustomLocalStorage();
  const [selectedRutinaId, setSelectedRutinaId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedJugadorId, setSelectedJugadorId] = useState<number>(0);
  const [listMode, setListMode] = useState<boolean>(false);
  const [rutinaList, setRutinaList] = useState<Array<RutinaType>>([]);

  useEffect(() => {
    // si mode no está definido lo define
    if (listMode !== simpleList) {
      setListMode(simpleList || false);
    }

    // carga todos los jugadores
    setRutinaList(storedRutinas);

    // si cantRenderItems está definido
    if (cantRenderItems) {
      setRutinaList(storedRutinas.slice(0, cantRenderItems));
    }
  }, [storedRutinas]);

  const deleteRutina = () => {
    popRutina(selectedRutinaId);
    setIsModalVisible(false);
  };

  const showDeleteModal = (rutinaId: number) => {
    setIsModalVisible(true);
    setSelectedJugadorId(rutinaId);
  };

  if (rutinaList.length == 0) {
    return (
      <View style={styles.emptyRutinasBody}>
        <Text style={styles.emptyRutinasText}>Sin Rutinas</Text>
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
  const { rutina, deleteRutina } = props;

  return (
    <View style={styles.completeItemContainer}>
      <View>
        <Icon name="circle" size={50} color="#3CB371" />
      </View>

      <Text style={styles.itemTitle}>{rutina.title}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon={'application-edit'} containerColor="#3CB371" iconColor="#fff" size={30} />
        <IconButton
          icon={'delete'}
          containerColor="#3CB371"
          iconColor="#fff"
          size={30}
          onPress={() => deleteRutina(rutina.id)}
        />
      </View>
    </View>
  );
};

const RenderSimpleItem = ({ title }: RutinaType) => {
  return (
    <View style={styles.simpleItemContainer}>
      <View>
        <Icon name="circle" size={50} color="#3CB371" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <Text style={styles.simpleItemSubText}>fecha</Text>
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
