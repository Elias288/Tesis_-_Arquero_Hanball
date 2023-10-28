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

type propsType = NativeStackScreenProps<RutinaTabPages, 'ViewRutina'>;

const ViewRutina = (props: propsType) => {
  const { navigation, route } = props;
  const { selectedId, rutina } = route.params;
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();

  const { popRutinaRealizada, rutinasRealizadas, popRutina } = useCustomLocalStorage();
  const [selectedRutina, setSelectedRutina] = useState<RutinaType>();

  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    if (rutina) {
      setSelectedRutina(rutina);
    } else if (selectedId) {
      setSelectedRutina(rutinasRealizadas.find((rutina) => rutina.id === selectedId));
    }
  }, []);

  const deleteRutina = () => {
    if (selectedId && selectedRutina) {
      popRutinaRealizada(selectedRutina.id);
    }

    if (rutina && selectedRutina) {
      popRutina(selectedRutina.id);
    }

    navigation.goBack();
  };

  const goBack = () => {
    if (selectedId) navigation.navigate('RutinasRealizadas');
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

          {!rutina && (
            <View style={{ flex: 1 }}>
              <Text>Jugador:</Text>
              <Text style={styles.jugadorName}>{selectedRutina?.jugador}</Text>
            </View>
          )}
        </View>

        {selectedRutina?.secuencia && (
          <ListarSecuenciaComponent
            secuencias={selectedRutina.secuencia}
            viewResult={!rutina}
            listStyle={{ flex: 1, marginBottom: 10 }}
          />
        )}

        {/* Actions */}
        <View style={styles.action}>
          {espConnectedStatus && BLEPowerStatus && (
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
            onPress={goBack}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            Volver
          </Button>
          <Button
            mode="outlined"
            onPress={() => setVisibleModal(true)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            Borrar
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
