import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { RutinaTabPages } from '../../navigation/RutinasTab';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';

import GlobalStyles from '../../utils/EstilosGlobales';
import ListarSecuenciaComponent from '../../components/ListarSecuencia.component';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { JugadorType } from '../../data/JugadoresType';
import formateDate from '../../utils/formateDate';
import HeaderComponent from '../../components/Header/Header.component';
import { ResultadoType } from '../../data/ResultadoType';

type propsType = NativeStackScreenProps<RutinaTabPages, 'ViewRutinaResultado'>;

const ViewRutinaResultado = (props: propsType) => {
  const { navigation, route } = props;
  const { rutina } = route.params;
  const { popRutinaRealizada, jugadores } = useCustomLocalStorage();

  const [selectedRutina, setSelectedRutina] = useState<ResultadoType>();
  const [jugadorDeRutina, setJugadorDeRutina] = useState<JugadorType>();

  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    if (rutina) {
      const recibedRutina: ResultadoType = JSON.parse(rutina);

      setSelectedRutina(recibedRutina);
      const jugadorById = jugadores.find((jugador) => jugador._id === recibedRutina.id_jugador);
      setJugadorDeRutina(jugadorById);
    }
  }, []);

  const deleteRutina = () => {
    if (rutina && selectedRutina) {
      popRutinaRealizada(selectedRutina._id);
    }

    navigation.goBack();
  };

  const goBack = () => {
    navigation.navigate('RutinasRealizadas');
  };

  return (
    <>
      <HeaderComponent title="Ver Resultado" showBackButton={true} />
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text>Rutina:</Text>
            <Text style={styles.title}>{selectedRutina?.titulo}</Text>
          </View>

          <>
            <View style={{ flex: 1 }}>
              <Text>Jugador:</Text>
              <Text style={GlobalStyles.jugadorName}>{jugadorDeRutina?.nombre}</Text>
            </View>
          </>
        </View>

        <View style={styles.infoContainer}>
          {selectedRutina && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Fecha de creación:</Text>
              <Text>{formateDate(new Date(selectedRutina.createDate), true)}</Text>
            </View>
          )}

          {selectedRutina && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Fecha realizada:</Text>
              <Text>{formateDate(new Date(selectedRutina.playedDate), true)}</Text>
            </View>
          )}
        </View>

        {selectedRutina && (
          <ListarSecuenciaComponent
            secuencias={selectedRutina.secuencias}
            listStyle={{ flex: 1, marginBottom: 10 }}
            viewResult={true}
          />
        )}

        {/* Actions */}
        <View style={styles.action}>
          <Button
            mode="outlined"
            onPress={() => setVisibleModal(true)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            Borrar
          </Button>

          <Button
            mode="outlined"
            onPress={goBack}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            Volver
          </Button>
        </View>
      </View>

      <CustomModal
        hideModal={() => setVisibleModal(false)}
        isVisible={visibleModal}
        isAcceptCancel={true}
        onAceptar={deleteRutina}
      >
        <Text style={customModalStyles.modalTitle}>Borrar Rutina</Text>
        <Text style={customModalStyles.modalMessage}>Seguro que quiere eliminar esta Rutina?</Text>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GlobalStyles.grayBackground, padding: 20 },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: GlobalStyles.white,
    padding: 10,
    borderRadius: 10,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jugadorName: {
    backgroundColor: '#e7d84f',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 20,
  },
});

export default ViewRutinaResultado;
