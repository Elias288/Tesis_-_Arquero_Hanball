import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import CustomModal from './CustomModal.component';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { secuenciaType } from '../data/RutinasType';
import ViewSecuenciaComponent from './ViewSecuencia.component';
import Constants from 'expo-constants';

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
  const [newSecuencia, setNewSecuencia] = useState<secuenciaType[]>([]);

  const handleSubmit = () => {
    if (title.trim() == '') {
      showModal('Titulo no puede estár vacio');
      return;
    }

    pushRutina({ id: rutinas.length, title, secuencia: newSecuencia });
    closeModal();
  };

  const closeModal = () => {
    setTitle('');
    setNewSecuencia([]);
    hideModal();
  };

  const showModal = (message: string) => {
    setIsModalVisible(true);
    setModalMessage(message);
  };

  const pushSecuencia = (ledId: string, time: number) => {
    setNewSecuencia([...newSecuencia, { id: `${newSecuencia.length}`, ledId, time }]);
  };

  return (
    <>
      <Portal>
        {visible && (
          <View style={styles.container}>
            <View style={{ backgroundColor: '#fff', padding: 5, borderRadius: 10 }}>
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
            <ViewSecuenciaComponent
              secuencias={newSecuencia}
              itemStyle={{ flex: 1 }}
              listStyle={{ borderTopWidth: 1, paddingTop: 10, marginTop: 20, flex: 1 }}
            />

            {/* Actions */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginVertical: 10,
              }}
            >
              <Button mode="contained" onPress={handleSubmit}>
                Crear
              </Button>
              <Button mode="contained" onPress={closeModal}>
                Cancelar
              </Button>
            </View>
          </View>
        )}
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

interface selectedItem {
  key: string;
  value: number;
  disabled: boolean;
}

interface crearSecuanciaProps {
  showModal: (text: string) => void;
  pushSecuencia: (led: string, time: number) => void;
}

const CrearSecuecia = (props: crearSecuanciaProps) => {
  const { showModal, pushSecuencia } = props;
  const [ledsIdList, setLedsIdList] = useState<Array<selectedItem>>([]);
  const [timeList, setTimeList] = useState<Array<selectedItem>>([]);

  const [ledIdSelected, setLedIdSelected] = useState<string>('1');
  const [timeSelected, setTimeSelected] = useState<string>('1');

  useEffect(() => {
    chargeLedList();
    chargeSecondsList();
  }, []);

  const chargeLedList = () => {
    const ledsIdList = [];
    for (let i = 1; i <= 4; i++) {
      ledsIdList.push({ key: `${i}`, value: i, disabled: false });
    }
    setLedsIdList(ledsIdList);
  };

  const chargeSecondsList = () => {
    const secondsList = [];
    for (let i = 1; i <= 10; i++) {
      secondsList.push({ key: `${i}`, value: i, disabled: false });
    }
    setTimeList(secondsList);
  };

  // const clean = () => {
  //   setLedIdSelected('1');
  //   setTimeSelected('1');
  // };

  const añadirSecuencia = () => {
    if (ledIdSelected.trim() == '') {
      showModal('Debe seleccionar un led');
      return;
    }

    if (timeSelected.trim() == '') {
      showModal('Debe seleccionar un tiempo');
      return;
    }

    pushSecuencia(ledIdSelected, +timeSelected);
    // clean();
  };

  return (
    <View style={{ borderTopWidth: 1, borderColor: '#000', marginTop: 20, paddingTop: 10 }}>
      <Text style={styles.subTitle}>Añadir Secuencia</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ paddingVertical: 10, flex: 1, marginRight: 10 }}>
          <View style={[styles.itemCircle, { backgroundColor: '#3CB371' }]}>
            <Icon name="led-on" size={40} color="#fff" />
            <Text style={styles.itemText}>Led</Text>
          </View>
          <SelectList
            setSelected={(ledId: number) => setLedIdSelected(`${ledId}`)}
            data={ledsIdList}
            placeholder="1"
            search={false}
          />
        </View>

        <View style={{ paddingVertical: 10, flex: 1 }}>
          <View style={[styles.itemCircle, { backgroundColor: '#3CB371' }]}>
            <Icon name="timer-sand-complete" size={40} color="#fff" />
            <Text style={styles.itemText}>Time</Text>
          </View>
          <SelectList
            setSelected={(second: number) => setTimeSelected(`${second}`)}
            data={timeList}
            placeholder="1"
            search={false}
          />
        </View>
      </View>

      {/* Actions */}
      <View>
        <Button
          buttonColor="#e7d84f"
          textColor="#746c26"
          onPress={añadirSecuencia}
          style={styles.buttonStyle}
        >
          Añadir
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: '100%',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#e7e7e7',
    position: 'absolute',
    top: Constants.statusBarHeight,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemCircle: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonStyle: {
    marginBottom: 10,
    borderColor: '#746c26',
    borderWidth: 1,
  },
});

export default ModalAgregarRutina;
