import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { inicioTabPages } from '../../navigation/InicioTab';
import HeaderComponent from '../../components/Header/Header.component';
import { Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';

import ModalJugar from './ModalJugar';
import GlobalStyles from '../../utils/EstilosGlobales';
import ListarSecuenciaComponent from '../../components/ListarSecuencia.component';
import { useCustomBLE } from '../../contexts/BLEProvider';
import { JugadorType } from '../../data/JugadoresType';
import { BLUETOOTHDISCONNECTED, BLUETOOTHNOTCONNECTED, BLUETOOTHOFF } from '../../utils/BleCodes';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { RutinaType } from '../../data/RutinasType';

type propsType = NativeStackScreenProps<inicioTabPages, 'Jugar'>;

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
    selectJugador,
    runGame,
    BLECode,
    connectedDevice,
    isGameRunning,
  } = useCustomBLE();

  const { jugadores } = useCustomLocalStorage();

  const [loading, setLoading] = useState<boolean>(false);
  const [paramRutina, setParamRutina] = useState<RutinaType>(JSON.parse(rutina));
  const [formatedRutina, setFormatedRutina] = useState<string>('');
  const [selectedJugador, setSelectedJugador] = useState<JugadorType | undefined>();
  const [selectedListJugadores, setSelectedListJugadores] = useState<
    Array<selectListJugadoresType>
  >([]);

  useEffect(() => {
    setSelectedListJugadores([]);
    chargeJugadores();
    setFormatedRutina(
      secuenciaToString(typeof paramRutina.secuencias !== 'string' ? paramRutina.secuencias : [])
    );
  }, []);

  useEffect(() => {
    if (!isGameRunning) {
      setLoading(false);
    }

    if (
      BLECode === BLUETOOTHNOTCONNECTED ||
      BLECode === BLUETOOTHOFF ||
      BLECode === BLUETOOTHDISCONNECTED
    ) {
      navigation.navigate('InicioPage');
    }
  }, [BLECode, isGameRunning]);

  const chargeJugadores = () => {
    jugadores.map((jugador) => {
      setSelectedListJugadores((selectedListJugadores) => [
        ...selectedListJugadores,
        { key: jugador.nombre, value: jugador.nombre },
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
    if (paramRutina) {
      selectRutina(paramRutina);
      selectJugador(selectedJugador);
    }
    setLoading(true);
    sendData(connectedDevice, formatedRutina);
  };

  return (
    <>
      <HeaderComponent title="Iniciar Rutina" />
      <View style={styles.startContainer}>
        <View style={{ paddingBottom: 20, flexDirection: 'row', flex: 1 }}>
          {/* Lista de secuencia */}
          <View style={{ marginRight: 10 }}>
            <Text style={styles.title}>Secuencia</Text>
            {typeof paramRutina.secuencias !== 'string' && (
              <ListarSecuenciaComponent
                secuencias={paramRutina.secuencias}
                listStyle={styles.viewSecuenciasStyle}
              />
            )}
          </View>

          {/* Seleccionar Jugador */}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Seleccionar Jugador</Text>
            <SelectList
              data={selectedListJugadores}
              setSelected={(jugadorId: string) => {
                setSelectedJugador(jugadores.find((jugador) => jugador._id == jugadorId));
              }}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={startGame}
          textColor={GlobalStyles.yellowTextColor}
          buttonColor="#e7d84f"
          style={GlobalStyles.buttonStyle}
        >
          Iniciar Rutina
        </Button>

        {typeof paramRutina.secuencias !== 'string' && (
          <ModalJugar
            isVisible={loading}
            hideModal={() => setLoading(false)}
            secuencia={paramRutina.secuencias}
            selectedJugadorName={selectedJugador ? selectedJugador?.nombre : ''}
          />
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
});
