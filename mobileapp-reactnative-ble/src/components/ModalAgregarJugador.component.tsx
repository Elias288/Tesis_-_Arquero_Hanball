import { View, StyleSheet, Text } from 'react-native';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { useState } from 'react';
import CustomModal from './CustomModal.component';

type propsType = {
  visible: boolean;
  hideModal: () => void;
};

const ModalAgregarJugador = ({ visible, hideModal }: propsType) => {
  const [name, setName] = useState<string>('');
  const { pushJugador, jugadores } = useCustomLocalStorage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState<string>('');

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
    setName('');
    hideModal();
  };

  const showModal = (message: string) => {
    setIsModalVisible(true);
    setModalText(message);
  };

  const closeModal = () => {
    setName('');
    hideModal();
  };

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
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
        title="Alerta"
        message={modalText}
        hideModal={() => setIsModalVisible(false)}
        callBack={() => {}}
        isVisible={isModalVisible}
      />
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