import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ActivityIndicator, Modal, Portal } from 'react-native-paper';

import ListarSecuenciaComponent from '../../components/ListarSecuencia.component';
import { secuenciaType } from '../../data/RutinasType';
import GlobalStyles from '../../utils/EstilosGlobales';

type ModalJugarProps = {
  isVisible: boolean;
  hideModal: () => void;
  secuencia: secuenciaType[];
  selectedJugadorName: string;
};

const ModalJugar = (props: ModalJugarProps) => {
  const { isVisible, secuencia, selectedJugadorName } = props;

  return (
    <Portal>
      <Modal visible={isVisible}>
        <View style={ModalJugarStyles.container}>
          <View style={ModalJugarStyles.infoCard}>
            <Text style={ModalJugarStyles.title}>Ejecutando</Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              {/* Lista de secuencia */}
              <View style={{ flex: 1 }}>
                <Text style={ModalJugarStyles.title}>Secuencia</Text>
                <ListarSecuenciaComponent
                  secuencias={secuencia}
                  listStyle={ModalJugarStyles.viewSecuenciasStyle}
                />
              </View>

              {/* Info jugador */}
              <View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
                <Text style={ModalJugarStyles.title}>Jugador: </Text>
                <Text style={ModalJugarStyles.jugadorName}>{selectedJugadorName}</Text>
              </View>
            </View>
          </View>

          {/* Indicador Spinner */}
          <View style={ModalJugarStyles.loadingContainer}>
            <ActivityIndicator animating={true} color={GlobalStyles.blueBackgroudn} size={150} />
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const ModalJugarStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: GlobalStyles.grayBackground,
    height: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: GlobalStyles.white,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jugadorName: {
    fontSize: 20,
    backgroundColor: '#e7d84f',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewSecuenciasStyle: {
    flex: 1,
  },
  loadingContainer: {
    flex: 2,
    padding: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalJugar;
