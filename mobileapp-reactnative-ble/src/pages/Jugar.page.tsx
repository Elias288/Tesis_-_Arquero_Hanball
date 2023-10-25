import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabPages } from '../navigation/HomeTab';
import HeaderComponent from '../components/Header.component';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useCustomBLE } from '../contexts/BLEProvider';
import { SelectList } from 'react-native-dropdown-select-list';
import { JugadorType } from '../data/JugadoresType';
import { BLUETOOTHNOTCONNECTED } from '../utils/BleCodes';
import ViewSecuenciaComponent from '../components/ViewSecuencia.component';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';

type propsType = NativeStackScreenProps<HomeTabPages, 'Jugar'>;

type selectListJugadoresType = {
  key: string;
  value: string;
};

const JugarPage = (props: propsType) => {
  const { navigation, route } = props;
  const { rutina } = route.params;
  const {
    sendData,
    secuenciaToString,
    selectRutina,
    runGame,
    BLECode,
    connectedDevice,
    isGameRunning,
  } = useCustomBLE();

  const { jugadores } = useCustomLocalStorage();

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
    if (!isGameRunning) {
      setLoading(false);
    }

    if (BLECode === BLUETOOTHNOTCONNECTED) {
      navigation.navigate('HomePage');
    }
  }, [BLECode, isGameRunning]);

  const chargeJugadores = () => {
    jugadores.map((jugador) => {
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

    if (!connectedDevice) {
      alert('No hay dispositivo conectado');
      return;
    }

    runGame(true);
    selectRutina({ ...rutina, jugador: selectedJugador.name });
    setLoading(true);
    sendData(connectedDevice, formatedRutina);
  };

  return (
    <>
      <HeaderComponent title="Iniciar Rutina" />
      <View style={styles.startContainer}>
        {!loading && (
          <>
            <View style={{ paddingBottom: 20, flexDirection: 'row', flex: 1 }}>
              {/* Lista de secuencia */}
              <View style={{ marginRight: 10 }}>
                <Text style={styles.title}>Secuencia</Text>
                <ViewSecuenciaComponent
                  secuencias={rutina.secuencia}
                  style={styles.viewSecuenciasStyle}
                />
              </View>

              {/* Seleccionar Jugador */}
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Seleccionar Jugador</Text>
                <SelectList
                  data={selectedListJugadores}
                  setSelected={(jugadorId: number) => {
                    setSelectedJugador(jugadores.find((jugador) => jugador.id == jugadorId));
                  }}
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={startGame}
              textColor="#746c26"
              buttonColor="#e7d84f"
              style={{ borderColor: '#746c26', borderWidth: 1 }}
            >
              Iniciar Rutina
            </Button>
          </>
        )}
        {loading && (
          <>
            <View style={{ paddingBottom: 20, flex: 1, flexDirection: 'row' }}>
              {/* Lista de secuencia */}
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Secuencia</Text>
                <ViewSecuenciaComponent
                  secuencias={rutina.secuencia}
                  style={styles.viewSecuenciasStyle}
                />
              </View>

              {/* Info jugador */}
              <View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
                <Text style={styles.title}>Jugador: </Text>
                <Text
                  style={{
                    fontSize: 20,
                    backgroundColor: '#e7d84f',
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {selectedJugador?.name}
                </Text>
              </View>
            </View>

            {/* Indicador Spinner */}
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} color={'#a9a9a9'} size={150} />
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default JugarPage;

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewSecuenciasStyle: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
