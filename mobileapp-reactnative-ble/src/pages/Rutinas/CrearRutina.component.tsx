import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Portal, TextInput } from 'react-native-paper';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';

import ListarSecuenciaComponent from '../../components/ListarSecuencia.component';
import GlobalStyles from '../../utils/EstilosGlobales';
import { RutinaType, secuenciaType } from '../../data/RutinasType';
import { InicioTabPages } from '../../navigation/InicioTab';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useCustomBLE } from '../../contexts/BLEProvider';

interface propsType {
  isVisible: boolean;
  hideModal: () => void;
}

const CrearRutina = (props: propsType) => {
  const navigator = useNavigation<NativeStackNavigationProp<InicioTabPages>>();
  const { isVisible: visible, hideModal } = props;
  const [title, setTitle] = useState('');
  const { pushRutina, rutinas } = useCustomLocalStorage();
  const [newRutina, setNewRutina] = useState<RutinaType>();
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();

  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false);
  const [isGameModalVisible, setIsGameModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [newSecuencia, setNewSecuencia] = useState<secuenciaType[]>([]);

  const handleSubmit = () => {
    if (title.trim() == '') {
      showModal('Titulo no puede estár vacio');
      return;
    }

    //TODO: comprobar lista de secuencia > 4 y titulo
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
            </View>

            {/* Warning */}
            {isWarningModalVisible && (
              <View style={{ backgroundColor: GlobalStyles.redError, padding: 10 }}>
                <Text style={[customModalStyles.modalTitle, { color: GlobalStyles.white }]}>
                  Alerta
                </Text>
                <Text style={[customModalStyles.modalMessage, { color: GlobalStyles.white }]}>
                  {modalMessage}
                </Text>
              </View>
            )}
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
    <View
      style={{ borderTopWidth: 1, borderColor: GlobalStyles.black, marginTop: 20, paddingTop: 10 }}
    >
      <Text style={styles.subTitle}>Añadir Secuencia</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ paddingVertical: 10, flex: 1, marginRight: 10 }}>
          <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
            <Icon name="led-on" size={40} color={GlobalStyles.white} />
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
          <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
            <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
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
          buttonColor={GlobalStyles.yellowBackColor}
          textColor={GlobalStyles.yellowTextColor}
          onPress={añadirSecuencia}
          style={[GlobalStyles.buttonStyle, { marginBottom: 10 }]}
        >
          Añadir
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  itemCircle: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemText: {
    color: GlobalStyles.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default CrearRutina;
