import { View, StyleSheet, Text } from 'react-native';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { useState } from 'react';
import CustomModal from './CustomModal.component';

type propsType = {
  isVisible: boolean;
  hideModal: () => void;
};

const ModalAgregarJugador = ({ isVisible, hideModal }: propsType) => {
  const [name, setName] = useState<string>('');
  const { pushJugador, jugadores } = useCustomLocalStorage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleSubmit = () => {
    if (name.trim() == '') {
      showModal('Nombre no puede estár vacio');
      return;
    }

    if (name.trim().length < 4) {
      showModal('Nombre demaciado corto');
      return;
    }

    pushJugador({ id: jugadores.length, name: name.trim() });
    closeModal();
  };

  const showModal = (message: string) => {
    setIsModalVisible(true);
    setModalMessage(message);
  };

  const closeModal = () => {
    setName('');
    hideModal();
  };

  return (
    <>
      <Portal>
        <Modal visible={isVisible} onDismiss={hideModal}>
          <View style={styles.container}>
            <Text style={styles.title}>Agregar Jugador</Text>

            <View style={{ flex: 1 }}>
              <TextInput
                label={'Nombre*'}
                style={{ marginVertical: 10 }}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10 }}>
              <Button mode="contained" onPress={handleSubmit}>
                Agregar
              </Button>
              <Button mode="contained" onPress={closeModal}>
                Cancelar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <CustomModal
        hideModal={() => setIsModalVisible(false)}
        isAccept={true}
        onAceptar={() => {}}
        isVisible={isModalVisible}
      >
        <View style={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Alerta</Text>
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>{modalMessage}</Text>
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default ModalAgregarJugador;
