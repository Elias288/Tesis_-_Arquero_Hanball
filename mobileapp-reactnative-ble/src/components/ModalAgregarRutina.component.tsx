import { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import CustomModal from './CustomModal.component';

interface propsType {
  isVisible: boolean;
  hideModal: () => void;
}

const ModalAgregarRutina = (props: propsType) => {
  const { isVisible: visible, hideModal } = props;
  const [title, setTitle] = useState('');
  const { pushRutina, rutinas } = useCustomLocalStorage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleSubmit = () => {
    if (title.trim() == '') {
      showModal('Titulo no puede estár vacio');
      return;
    }

    pushRutina({ id: rutinas.length, title, secuencia: [] });
    closeModal();
  };

  const closeModal = () => {
    setTitle('');
    hideModal();
  };

  const showModal = (message: string) => {
    setIsModalVisible(true);
    setModalMessage(message);
  };

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.container}>
            <Text style={styles.title}>Agregar Rutina</Text>

            <View style={{ flex: 1 }}>
              <TextInput
                label={'Titulo de la Rutina*'}
                style={{ marginVertical: 10 }}
                value={title}
                onChangeText={setTitle}
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

export default ModalAgregarRutina;
