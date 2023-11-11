import React, { FC, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

import CustomCardHistorialRutinas from './CustomCardHistorialRutinas';
import CustomCardCrearRutinas from './CustomCardCrearRutinas';
import CustomCardJugadores from './CustomCardJugadores';
import GlobalStyles from '../../utils/EstilosGlobales';
import HeaderComponent from '../../components/Header/Header.component';
import CustomModal, { customModalStyles } from '../../components/CustomModal.component';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';

const InicioPage: FC = () => {
  const { token } = useCustomRemoteStorage();
  const [showAlertModal, setShowAlertModal] = useState<boolean>(token === 'local');

  return (
    <View style={styles.container}>
      <HeaderComponent title={'DEAH App'} />

      <ScrollView contentContainerStyle={styles.scrollStyles}>
        <View>
          <CustomCardCrearRutinas />

          <CustomCardJugadores />

          <CustomCardHistorialRutinas />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={showAlertModal}
        hideModal={() => setShowAlertModal(false)}
        isAccept={true}
      >
        <Text style={customModalStyles.modalTitle}>Alerta</Text>
        <Text style={customModalStyles.modalMessage}>
          La sesion se ha iniciado en forma local debido a que no se ha podido conectrar a la api
        </Text>
        <Text style={customModalStyles.modalMessage}>
          Solo podrá utilizar los datos que se encuentren registrados localmente
        </Text>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.grayBackground,
    flex: 1,
  },
  scrollStyles: {
    paddingTop: 13,
    paddingHorizontal: 13,
  },
});
export default InicioPage;
