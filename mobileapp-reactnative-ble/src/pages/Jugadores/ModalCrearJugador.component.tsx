import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import uuid from 'react-native-uuid';

import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import GlobalStyles from '../../utils/EstilosGlobales';
import { JugadorType } from '../../data/JugadoresType';

type propsType = {
  isVisible: boolean;
  hideModal: () => void;
  editJugador?: JugadorType;
};

const ModalCrearJugador = ({ isVisible, hideModal, editJugador }: propsType) => {
  const [name, setName] = useState<string>('');
  const { jugadores, pushJugador, findJugador, updateJugador } = useCustomLocalStorage();
  const prevJugador: JugadorType | undefined = editJugador;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  useEffect(() => {
    if (editJugador) setName(editJugador.nombre);
  }, [editJugador]);

  const handleSubmit = () => {
    if (name.trim() == '') {
      showModal('Nombre no puede estár vacio');
      return;
    }

    if (name.trim().length < 4) {
      showModal('Nombre demasiado corto');
      return;
    }

    if (name.trim().length > 20) {
      showModal('Nombre demasiado largo');
      return;
    }

    if (findJugador(name.trim(), undefined)) {
      showModal('Nombre de jugador ya registrado');
      return;
    }

    pushJugador({
      _id: uuid.v4().toString().replace(/-/g, ''),
      nombre: name.trim(),
      fechaCreación: new Date(),
    });
    closeModal();
  };

  const handleEdit = () => {
    if (prevJugador && prevJugador.nombre != name) {
      if (name.trim() == '') {
        showModal('Nombre no puede estár vacio');
        return;
      }

      if (name.trim().length < 4) {
        showModal('Nombre demasiado corto');
        return;
      }

      if (name.trim().length > 20) {
        showModal('Nombre demasiado largo');
        return;
      }

      if (findJugador(name.trim(), undefined)) {
        showModal('Nombre de jugador ya registrado');
        return;
      }

      updateJugador({ ...prevJugador, nombre: name });
      closeModal();
    }
  };

  const showModal = (message: string) => {
    setIsModalVisible(true);
    setModalMessage(message);
  };

  const closeModal = () => {
    setName('');
    setIsModalVisible(false);
    hideModal();
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: GlobalStyles.white, borderRadius: 20, padding: 5 }}>
              <Text style={styles.title}>Agregar Jugador</Text>
              <TextInput
                label={'Nombre*'}
                style={{ marginVertical: 10 }}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10 }}>
            {editJugador ? (
              <Button mode="contained" onPress={handleEdit}>
                Editar
              </Button>
            ) : (
              <Button mode="contained" onPress={handleSubmit}>
                Agregar
              </Button>
            )}
            <Button mode="contained" onPress={closeModal}>
              Cancelar
            </Button>
          </View>
          {isModalVisible && (
            <View style={warningStyles.warningContainer}>
              <Text style={warningStyles.warningTitle}>Alerta</Text>
              <Text style={{ color: GlobalStyles.white }}>{modalMessage}</Text>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: GlobalStyles.grayBackground,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
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
export default ModalCrearJugador;
