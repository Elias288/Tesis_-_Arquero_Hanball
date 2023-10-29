import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HeaderComponent from '../../../components/Header.component';
import GlobalStyles from '../../../utils/EstilosGlobales';
import { ListaJugadoresTabPages } from '../../../navigation/ListaJugadoresTab';
import { useCustomLocalStorage } from '../../../contexts/LocalStorageProvider';
import { JugadorType } from '../../../data/JugadoresType';
import { RutinaType } from '../../../data/RutinasType';
import { RenderItemRutinaDeJugador } from './RenderItemRutinaDeJugador';
import formateDate from '../../../utils/formateDate';

type propsType = NativeStackScreenProps<ListaJugadoresTabPages, 'ViewJugadores'>;

const ViewJugadorPage = (props: propsType) => {
  const { navigation, route } = props;
  const { jugadores, getRutinasJugadasDeJugador, rutinasRealizadas } = useCustomLocalStorage();
  const { jugadorId } = route.params;

  const [jugador, setJugador] = useState<JugadorType>();
  const [rutinasJugadas, setRutinasJugadas] = useState<Array<RutinaType>>();

  useEffect(() => {
    const jugadorById = jugadores.find((jugador) => jugador.id == jugadorId);
    const rutinasJugadas = getRutinasJugadasDeJugador(jugadorId);
    setJugador(jugadorById);
    setRutinasJugadas(rutinasJugadas);
  }, [rutinasRealizadas]);

  return (
    <>
      <HeaderComponent title={'Jugador'} showBackButton={true} />
      <View style={styles.container}>
        {/* Jugador info */}
        <View style={styles.containerTitle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Jugador: </Text>
            <Text style={GlobalStyles.jugadorName}>{jugador?.name}</Text>
          </View>
        </View>

        {jugador?.date && (
          <View style={styles.containerTitle}>
            <Text style={{ fontWeight: 'bold' }}>Fecha de creación:</Text>
            <Text>{formateDate(new Date(jugador.date), true)}</Text>
          </View>
        )}

        {/* Historial de rutinas */}
        <View style={styles.containerList}>
          <Text style={styles.title}>Historial de entrenamientos</Text>
          {rutinasJugadas?.length == 0 ? (
            <Text style={styles.emptyListMessage}>Sin Rutinas Realizadas</Text>
          ) : (
            <FlatList
              data={rutinasJugadas}
              renderItem={({ item }) => <RenderItemRutinaDeJugador rutina={item} />}
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerTitle: {
    backgroundColor: GlobalStyles.white,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  containerList: {
    minHeight: 50,
    backgroundColor: GlobalStyles.white,
    padding: 10,
    marginBottom: 15,
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
});

export default ViewJugadorPage;
