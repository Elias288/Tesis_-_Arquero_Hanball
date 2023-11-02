import { RutinaType, secuenciaType } from '../../../data/RutinasType';
import { Button, Portal, TextInput } from 'react-native-paper';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';

import GlobalStyles from '../../../utils/EstilosGlobales';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { useCustomLocalStorage } from '../../../contexts/LocalStorageProvider';
import { CrearSecuecia } from '../CrearRutina/CrearSecuecia';
import EditListaSecuenciaComponent from './EditListSecuencias';

interface propsType {
  isVisible: boolean;
  hideModal: () => void;
  editRutina: RutinaType;
}

const ModalUpdateRutina = ({ hideModal, isVisible, editRutina }: propsType) => {
  const { updateRutina, rutinas } = useCustomLocalStorage();

  // const prevRutina: RutinaType | undefined = editRutina; // Rutina a editar
  const [prevRutina, setPrevRutina] = useState<RutinaType>(editRutina);
  const [title, setTitle] = useState(editRutina.title); // Titulo de rutina
  const [selectedSecuencia, setSelectedSecuencia] = useState<secuenciaType>(); // Secuencia seleccionada para editar
  const [newSecuencias, setNewSecuencias] = useState<secuenciaType[]>(editRutina.secuencia);

  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false); // Muestra alerta
  const [modalMessage, setModalMessage] = useState<string>(''); // Mensaje de la alerta

  const handleSubmit = () => {
    if (title.trim() == '') {
      showModal('Titulo no puede estár vacio');
      return;
    }

    if (title.trim().length < 4) {
      showModal('Titulo demasiado corto');
      return;
    }

    if (title.trim().length > 20) {
      showModal('Titulo demasiado largo');
      return;
    }

    if (newSecuencias.length < 4) {
      showModal('La cantidad de secuencias no puede ser menor a 4');
      return;
    }

    if (
      prevRutina.title.trim() !== title.trim() &&
      rutinas.find((rutina) => rutina.title === title)
    ) {
      showModal('Titulo ya registrado');
      return;
    }

    const rutina = {
      ...prevRutina,
      title: title.trim(),
      secuencia: newSecuencias,
    };

    if (JSON.stringify(prevRutina) !== JSON.stringify(rutina)) {
      updateRutina(rutina);
    }

    setShowAdd(false);
    setShowEdit(false);
    setIsWarningModalVisible(false);
    hideModal();
  };

  const selectSecuencia = (secuencia: secuenciaType) => {
    setShowEdit(true);
    setShowAdd(false);
    setSelectedSecuencia(secuencia);
  };

  const deleteSecuencia = (secuenciaId: string) => {
    setNewSecuencias((prevSecuencias) => prevSecuencias.filter((sec) => sec.id !== secuenciaId));
  };

  const updateSecuencia = (secuencia: secuenciaType) => {
    setNewSecuencias((prevSecuencias) =>
      prevSecuencias.map((sec) => {
        if (sec.id === secuencia.id) {
          return secuencia;
        }
        return sec;
      })
    );

    setShowEdit(false);
  };

  const cancelEdit = () => {
    setTitle(editRutina.title);
    setNewSecuencias(editRutina.secuencia);
    setIsWarningModalVisible(false);
    setShowAdd(false);
    setShowEdit(false);
    hideModal();
  };

  const showModal = (message: string) => {
    setIsWarningModalVisible(true);
    setModalMessage(message);
  };

  const pushSecuencia = (ledId: string, time: number) => {
    setNewSecuencias([
      ...newSecuencias,
      { id: uuid.v4().toString().replace(/-/g, ''), ledId, time },
    ]);
    setShowAdd(false);
  };

  return (
    <Portal>
      {isVisible && (
        <View style={styles.modal}>
          <View style={styles.container}>
            <Text style={styles.title}>Editar Rutina</Text>
            <View style={styles.card}>
              <TextInput
                label={'Titulo de la Rutina*'}
                style={{ marginVertical: 10 }}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={[styles.card]}>
              {!showAdd && !showEdit && <Button onPress={() => setShowAdd(true)}>Agregar</Button>}

              {showEdit && (
                <CrearSecuecia
                  callModal={showModal}
                  updateSecuencia={updateSecuencia}
                  secuencia={selectedSecuencia}
                />
              )}

              {showAdd && <CrearSecuecia callModal={showModal} pushSecuencia={pushSecuencia} />}
            </View>

            <View style={[styles.card, { flex: 1 }]}>
              {/* <ListarSecuenciaComponent secuencias={newSecuencias} editable={selectSecuencia} /> */}
              <EditListaSecuenciaComponent
                secuencias={newSecuencias}
                edit={selectSecuencia}
                deleteSecuencia={deleteSecuencia}
              />
            </View>

            {/* Actions */}
            <View style={styles.actionContainer}>
              <Button mode="contained" onPress={handleSubmit}>
                Actualizar
              </Button>
              <Button mode="contained" onPress={cancelEdit}>
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
  card: {
    backgroundColor: GlobalStyles.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 13,
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

export default ModalUpdateRutina;
