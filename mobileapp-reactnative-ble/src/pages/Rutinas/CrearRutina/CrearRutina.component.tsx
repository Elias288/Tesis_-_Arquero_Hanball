import { useState } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../../../contexts/LocalStorageProvider';
import CustomModal, { customModalStyles } from '../../../components/CustomModal.component';
import Constants from 'expo-constants';

import ListarSecuenciaComponent from '../../../components/ListarSecuencia.component';
import GlobalStyles from '../../../utils/EstilosGlobales';
import { RutinaType, secuenciaType } from '../../../data/RutinasType';
import { inicioTabPages } from '../../../navigation/InicioTab';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useCustomBLE } from '../../../contexts/BLEProvider';
import { CrearSecuecia } from './CrearSecuecia';

interface propsType {
  isVisible: boolean;
  hideModal: () => void;
}

const CrearRutina = (props: propsType) => {
  const navigator = useNavigation<NativeStackNavigationProp<inicioTabPages>>();
  const { isVisible: visible, hideModal } = props;
  const [title, setTitle] = useState('');
  const { rutinas, pushRutina, findRutina } = useCustomLocalStorage();
  const [newRutina, setNewRutina] = useState<RutinaType>();
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();

  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false);
  const [isGameModalVisible, setIsGameModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [newSecuencia, setNewSecuencia] = useState<secuenciaType[]>([]);

  const handleSubmit = () => {
    setIsWarningModalVisible(false);

    if (title.trim() == '') {
      showModal('Titulo no puede estár vacio');
      return;
    }

    if (title.trim().length < 4) {
      showModal('Titulo demaciado corto');
      return;
    }

    if (findRutina(title, undefined)) {
      showModal('Titulo de rutina ya registrada');
      return;
    }

    if (newSecuencia.length < 4) {
      showModal('La cantidad de secuencias no puede ser menor a 4');
      return;
    }

    setNewRutina({ id: rutinas.length, title, secuencia: newSecuencia, createDate: new Date() });
    pushRutina({ id: rutinas.length, title, secuencia: newSecuencia, createDate: new Date() });

    setModalMessage('');

    if (espConnectedStatus && BLEPowerStatus) {
      setIsGameModalVisible(true);
    }
    closeModal();
  };

  const gotoJugar = () => {
    closeModal();
    if (newRutina) navigator?.navigate('Jugar', { rutina: JSON.stringify(newRutina) });
  };

  const closeModal = () => {
    setTitle('');
    setNewSecuencia([]);
    hideModal();
    setIsWarningModalVisible(false);
  };

  const showModal = (message: string) => {
    setIsWarningModalVisible(true);
    setModalMessage(message);
  };

  const pushSecuencia = (ledId: string, time: number) => {
    setNewSecuencia([...newSecuencia, { id: `${newSecuencia.length}`, ledId, time }]);
  };

  return (
    <>
      <Portal>
        {visible && (
          <View style={styles.modal}>
            <View style={styles.container}>
              <View style={{ backgroundColor: GlobalStyles.white, padding: 5, borderRadius: 10 }}>
                <Text style={styles.title}>Crear Rutina</Text>
                <TextInput
                  label={'Titulo de la Rutina*'}
                  style={{ marginVertical: 10 }}
                  value={title}
                  onChangeText={setTitle}
                />

                <CrearSecuecia showModal={showModal} pushSecuencia={pushSecuencia} />
              </View>

              {/* //TODO: convertir los componentes en swipes para poder eliminarlos */}
              <ListarSecuenciaComponent
                secuencias={newSecuencia}
                itemStyle={{ flex: 1 }}
                listStyle={{ borderTopWidth: 1, paddingTop: 10, marginTop: 20, flex: 1 }}
              />

              {/* Actions */}
              <View style={styles.actionContainer}>
                <Button mode="contained" onPress={handleSubmit}>
                  Crear
                </Button>
                <Button mode="contained" onPress={closeModal}>
                  Cancelar
                </Button>
              </View>

              {/* Warning */}
              {isWarningModalVisible && (
                <View style={warningStyles.warningContainer}>
                  <Text style={warningStyles.warningTitle}>Alerta</Text>
                  <Text style={{ color: GlobalStyles.white }}>{modalMessage}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Portal>

      {/* Alerta Jugar */}
      <CustomModal
        isVisible={isGameModalVisible}
        hideModal={() => setIsGameModalVisible(false)}
        isAcceptCancel={true}
        onAceptar={gotoJugar}
        onCancelar={closeModal}
        containerStyle={{ zIndex: 1000 }}
      >
        <Text style={customModalStyles.modalMessage}>Desea iniciar un juego con esta rutina?</Text>
      </CustomModal>
    </>
  );
};

export const styles = StyleSheet.create({
  modal: {
    height: Dimensions.get('window').height,
    width: '100%',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: Constants.statusBarHeight,
    zIndex: 10,
    backgroundColor: GlobalStyles.grayBackground,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
});

export const warningStyles = StyleSheet.create({
  warningContainer: {
    backgroundColor: GlobalStyles.redError,
    padding: 10,
    borderRadius: 10,
  },
  warningTitle: {
    fontSize: 18,
    color: GlobalStyles.white,
    fontWeight: 'bold',
  },
});

export default CrearRutina;
