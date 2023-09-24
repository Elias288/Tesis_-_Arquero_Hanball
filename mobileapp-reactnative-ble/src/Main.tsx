import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { PaperProvider } from 'react-native-paper';
import DemoHome from './Demo_Home';
import useBLE from './components/useBLE';
import DemoCrearSecuenca from './Demo_crear_secuencia';

/************************************************* Main *************************************************/
const Main = () => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    sendData,
    BLEmsg,
    connectedDevice,
    espStatus,
    receivedMSG
  } = useBLE();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Mobile App - React Native - BLE</Text>

        <DemoHome
          scanAndConnectPeripherals={scanAndConnectPeripherals}
          disconnectFromDevice={disconnectFromDevice}
          requestPermissions={requestPermissions}
          sendData={sendData}
          connectedDevice={connectedDevice}
          espStatus={espStatus}
          BLEmsg={BLEmsg}
          receivedMSG={receivedMSG}
        />

        <DemoCrearSecuenca connectedDevice={connectedDevice} sendData={sendData} />
      </View>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 20,
    justifyContent: 'center',
  },
});

export default Main;
