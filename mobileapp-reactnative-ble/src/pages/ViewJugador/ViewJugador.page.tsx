import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import HeaderComponent from '../../components/Header/Header.component';
import GlobalStyles from '../../utils/EstilosGlobales';
import { ListaJugadoresTabPages } from '../../navigation/ListaJugadoresTab';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { JugadorType } from '../../data/JugadoresType';
import formateDate from '../../utils/formateDate';
import { RenderItemRutinaDeJugador } from './RenderItemRutinaDeJugador';
import { Button } from 'react-native-paper';
import ModalCrearJugador from '../Jugadores/ModalCrearJugador.component';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import { ResultadoType } from '../../data/ResultadoType';

type propsType = NativeStackScreenProps<ListaJugadoresTabPages, 'ViewJugadores'>;

const ViewJugadorPage = (props: propsType) => {
  const { navigation, route } = props;
  const { jugadores, rutinasRealizadas, getRutinasJugadasDeJugador, findJugador, popJugador } =
    useCustomLocalStorage();
  const { jugadorId } = route.params;

  const [jugador, setJugador] = useState<JugadorType>();
  const [rutinasJugadas, setRutinasJugadas] = useState<Array<ResultadoType>>();

  const [isCreateModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setisDeleteModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const jugadorById = findJugador(undefined, jugadorId);
    const rutinasJugadas = getRutinasJugadasDeJugador(jugadorId);
    setJugador(jugadorById);
    setRutinasJugadas(rutinasJugadas);
  }, [rutinasRealizadas, jugadores]);

  const deleteJugador = () => {
    popJugador(jugadorId);
    navigation.goBack();
  };

  return (
    <>
      <HeaderComponent title={'Jugador'} showBackButton={true} />
      <View style={styles.container}>
        {/* Jugador info */}
        <View style={styles.containerTitle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Text>Jugador: </Text>
            <Text style={GlobalStyles.jugadorName} textBreakStrategy="simple">
              {jugador?.nombre}
            </Text>
          </View>
        </View>

        {jugador?.fechaCreación && (
          <View style={styles.containerTitle}>
            <Text style={{ fontWeight: 'bold' }}>Fecha de creación:</Text>
            <Text>{formateDate(new Date(jugador.fechaCreación), true)}</Text>
          </View>
        )}

        {/* Historial de rutinas */}
        <View style={styles.containerList}>
          <Text style={styles.title}>Historial de entrenamientos</Text>
          {rutinasJugadas?.length == 0 ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.emptyListMessage}>Sin Rutinas Realizadas</Text>
            </View>
          ) : (
            <FlatList
              data={rutinasJugadas}
              renderItem={({ item }) => <RenderItemRutinaDeJugador rutina={item} />}
            />
          )}
        </View>

        <View style={styles.actionContainer}>
          <Button mode="outlined" onPress={() => setisDeleteModalVisible(true)}>
            Borrar
          </Button>

          <Button mode="outlined" onPress={() => setIsModalVisible(true)}>
            Editar
          </Button>
        </View>
      </View>

      <ModalCrearJugador
        isVisible={isCreateModalVisible}
        hideModal={() => setIsModalVisible(false)}
        editJugador={jugador}
      />

      <CustomModal
        hideModal={() => setisDeleteModalVisible(false)}
        isVisible={isDeleteModalVisible}
        isAcceptCancel={true}
        onAceptar={deleteJugador}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Jugador</Text>
        <Text style={customModalStyles.modalMessage}>Seguro que quiere eliminar este Jugador?</Text>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: GlobalStyles.grayBackground,
  },
  containerTitle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: GlobalStyles.white,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  containerList: {
    flex: 1,
    minHeight: 50,
    backgroundColor: GlobalStyles.white,
    padding: 10,
    // marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyListMessage: {
    color: GlobalStyles.grayText,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionContainer: {
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

export default ViewJugadorPage;
