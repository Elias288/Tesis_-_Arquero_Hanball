import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../../components/Header.component';
import { View, Text, StyleSheet } from 'react-native';
import { RutinaTabPages } from '../../navigation/RutinasTab';
import { useEffect, useState } from 'react';

import GlobalStyles from '../../utils/EstilosGlobales';
import ListarSecuenciaComponent from '../../components/ListarSecuencia.component';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import { RutinaType } from '../../data/RutinasType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { Button, IconButton } from 'react-native-paper';
import { useCustomBLE } from '../../contexts/BLEProvider';
import { JugadorType } from '../../data/JugadoresType';
import formateDate from '../../utils/formateDate';

type propsType = NativeStackScreenProps<RutinaTabPages, 'ViewRutina'>;

const ViewRutina = (props: propsType) => {
  const { navigation, route } = props;
  const { rutinaId, rutina, isRutinaResultado } = route.params;
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  const { popRutinaRealizada, rutinasRealizadas, popRutina, jugadores } = useCustomLocalStorage();

  const [selectedRutina, setSelectedRutina] = useState<RutinaType>();
  const [jugadorDeRutina, setJugadorDeRutina] = useState<JugadorType>();

  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    if (rutina) {
      const recibedRutina = JSON.parse(rutina);
      setSelectedRutina(recibedRutina);

      if (isRutinaResultado) {
        const jugadorById = jugadores.find((jugador) => jugador.id === recibedRutina.jugadorID);
        setJugadorDeRutina(jugadorById);
      }
    } else if (rutinaId) {
      const rutinaById = rutinasRealizadas.find((rutina) => rutina.id === rutinaId);
      setSelectedRutina(rutinaById);

      if (isRutinaResultado) {
        const jugadorById = jugadores.find((jugador) => jugador.id === rutinaById?.jugadorID);
        setJugadorDeRutina(jugadorById);
      }
    }
  }, []);

  const deleteRutina = () => {
    if (rutinaId && selectedRutina) {
      popRutinaRealizada(selectedRutina.id);
    }

    if (rutina && selectedRutina) {
      popRutina(selectedRutina.id);
    }

    navigation.goBack();
  };

  const goBack = () => {
    if (rutinaId) navigation.navigate('RutinasRealizadas');
    if (rutina) navigation.navigate('RutinasPage');
  };

  return (
    <>
      <HeaderComponent title="Ver Rutina" showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text>Rutina:</Text>
            <Text style={styles.title}>{selectedRutina?.title}</Text>
          </View>

          {isRutinaResultado && (
            <>
              <View style={{ flex: 1 }}>
                <Text>Jugador:</Text>
                <Text style={GlobalStyles.jugadorName}>{jugadorDeRutina?.name}</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.infoContainer}>
          {selectedRutina?.createDate && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Fecha de creación:</Text>
              <Text>{formateDate(new Date(selectedRutina?.createDate), true)}</Text>
            </View>
          )}
          {selectedRutina?.playedDate && (
            <View style={{ flex: 1 }}>
              <Text>Fecha realizada:</Text>
              <Text>{formateDate(new Date(selectedRutina?.playedDate), true)}</Text>
            </View>
          )}
        </View>

        {selectedRutina?.secuencia && (
          <ListarSecuenciaComponent
            secuencias={selectedRutina.secuencia}
            viewResult={isRutinaResultado}
            listStyle={{ flex: 1, marginBottom: 10 }}
          />
        )}

        {/* Actions */}
        <View style={styles.action}>
          {espConnectedStatus && BLEPowerStatus && !isRutinaResultado && (
            <View style={{ marginHorizontal: 10 }}>
              <IconButton
                icon={'play'}
                containerColor={GlobalStyles.greenBackColor}
                iconColor={GlobalStyles.white}
                size={30}
                onPress={() => alert('go to play')}
              />
            </View>
          )}
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

export default ViewRutina;
