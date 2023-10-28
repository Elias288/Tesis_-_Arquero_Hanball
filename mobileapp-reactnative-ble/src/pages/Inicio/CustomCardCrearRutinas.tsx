import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CrearRutinaAleatoriaComponent from '../../components/CrearRutinaAleatoria.component';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import CrearRutina from '../Rutinas/CrearRutina.component';
import OptionButtons from './OptionButtons';
import CustomCard, { cardStyles } from './CustomCard';
import { RootTabs } from '../../Main';
import { useCustomBLE } from '../../contexts/BLEProvider';

const CustomCardCrearRutinas: FC = () => {
  const [visibleDialogCreateRandom, setVisibleDialogCreateRandom] = useState<boolean>(false);
  const [visibleDialogCreate, setVisibleDialogCreate] = useState<boolean>(false);
  const [visibleDialogWarning, setVisibleDialogWarning] = useState<boolean>(false);
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();

  const cargarRutina = () => {
    if (!espConnectedStatus || !BLEPowerStatus) {
      setVisibleDialogWarning(true);
    } else {
      navigator.navigate('Rutinas', { screen: 'RutinasPage' });
    }
  };
  const crearRutinaAleatoria = () => {
    if (!espConnectedStatus || !BLEPowerStatus) {
      setVisibleDialogWarning(true);
    } else {
      setVisibleDialogCreateRandom(true);
    }
  };
  const closeAllModals = () => {
    setVisibleDialogCreate(false);
    setVisibleDialogCreateRandom(false);
    setVisibleDialogWarning(false);
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Crear Rutina</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>

        <View style={cardStyles.cardOptions}>
          <OptionButtons text="Rutina Aleatoria" icon="dice-6" action={crearRutinaAleatoria} />
          <OptionButtons
            text="Crear Rutina"
            icon="plus"
            action={() => setVisibleDialogCreate(true)}
          />

          <OptionButtons text="Cargar Rutina" icon="upload" action={cargarRutina} />
        </View>
      </View>

      {/* Modal de crear rutina */}
      <CrearRutina
        isVisible={visibleDialogCreate}
        hideModal={() => setVisibleDialogCreate(false)}
      />

      {/* Modal de crear rutina aleatoria */}
      <CrearRutinaAleatoriaComponent
        setVisibleDialogCreateRandom={setVisibleDialogCreateRandom}
        visible={visibleDialogCreateRandom}
      />

      <CustomModal isAccept={true} hideModal={closeAllModals} isVisible={visibleDialogWarning}>
        <View>
          <Text style={customModalStyles.modalTitle}>Bluetooth no está conectado</Text>
          <Text style={customModalStyles.modalMessage}>
            Enciendaló para poder generar una rutina
          </Text>
        </View>
      </CustomModal>
    </CustomCard>
  );
};

export default CustomCardCrearRutinas;
