import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabPages } from '../navigation/HomeTab';
import HeaderComponent from '../components/Header.component';
import { ActivityIndicator, Button, List } from 'react-native-paper';
import { useCustomBLEProvider } from '../utils/BLEProvider';
import { SelectList } from 'react-native-dropdown-select-list';
import { JugadorType, ListaDeJugadores } from '../data/ListaDeJugadores.data';
import { BLUETOOTHNOTCONNECTED } from '../utils/BleCodes';

type propsType = NativeStackScreenProps<HomeTabPages, 'Jugar'>;

type selectListJugadoresType = {
  key: string;
  value: string;
};

const JugarPage = (props: propsType) => {
  const { navigation, route } = props;
  const { rutina } = route.params;
  const { sendData, secuenciaToString, BLECode, connectedDevice } = useCustomBLEProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [formatedRutina, setFormatedRutina] = useState<string>('');
  const [selectedJugador, setSelectedJugador] = useState<JugadorType | undefined>();
  const [selectedListJugadores, setSelectedListJugadores] = useState<
    Array<selectListJugadoresType>
  >([]);

  useEffect(() => {
    setSelectedListJugadores([]);
    chargeJugadores();
    setFormatedRutina(secuenciaToString(rutina.secuencia));
  }, []);

  useEffect(() => {
    if (BLECode === BLUETOOTHNOTCONNECTED) {
      navigation.navigate('HomePage');
    }
  }, [BLECode]);

  const chargeJugadores = () => {
    ListaDeJugadores.map((jugador) => {
      setSelectedListJugadores((selectedListJugadores) => [
        ...selectedListJugadores,
        { key: jugador.id.toString(), value: jugador.name },
      ]);
    });
  };

  const startGame = () => {
    if (!rutina || !formatedRutina) {
      alert('no hay rutina');
      return;
    }

    if (!selectedJugador) {
      alert('no se seleccionó el jugador');
      return;
    }

    if (connectedDevice) {
      setLoading(true);
      // alert(`iniciar juego \n(${selectedJugador.id}) ${selectedJugador.name} \n "${formatedRutina}"`);
      sendData(connectedDevice, formatedRutina);
    } else {
      setLoading(true);
      alert('No hay dispositivo conectado');
      return;
    }
  };

  return (
    <>
      <HeaderComponent title="Iniciar Rutina" />
      {!loading && (
        <View style={styles.startContainer}>
          <>
            <View style={{ padding: 20 }}>
              <Text>{JSON.stringify(rutina, null /* , 4 */)}</Text>
              <Text>{formatedRutina}</Text>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={styles.title}>Seleccionar Jugador</Text>

              <SelectList
                data={selectedListJugadores}
                setSelected={(jugadorId: number) => {
                  setSelectedJugador(ListaDeJugadores.find((jugador) => jugador.id == jugadorId));
                }}
              />
            </View>

            <View style={{ alignItems: 'center', padding: 20 }}>
              <Button mode="elevated" onPress={startGame}>
                Iniciar Rutina
              </Button>
            </View>
          </>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          {/* <Text>Rutina: {JSON.stringify(rutina.secuencia, null)}</Text> */}
          <Text>{formatedRutina}</Text>
          <Text>Jugador: {selectedJugador?.name}</Text>
          <ActivityIndicator animating={true} color={'#a9a9a9'} size={150} />
        </View>
      )}
    </>
  );
};

export default JugarPage;

const styles = StyleSheet.create({
  startContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
  },
});
