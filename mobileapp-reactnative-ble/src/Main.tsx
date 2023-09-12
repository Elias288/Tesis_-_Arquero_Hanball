import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import useBLE from './components/useBLE';
import { Button, PaperProvider } from 'react-native-paper';

/************************************************* Main *************************************************/
const Main = () => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    BLEmsg,
    espDevice,
    connectedDevice,
  } = useBLE();

  useEffect(() => {
    disconnectFromDevice();
    scanForDevices();
  }, []);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Mobile App - React Native - BLE</Text>

        {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}

        <Button onPress={() => scanForDevices()}>Scan</Button>

        <Text>{connectedDevice !== null ? 'Conectado' : 'No conectado'}</Text>
        <Text>{`${BLEmsg}`}</Text>

        <ScrollView>
          <Text>{JSON.stringify(espDevice, null, 4)}</Text>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 20,
    backgroundColor: '#dbdbdb',
  },
  ctaButton: {
    backgroundColor: '#1aa70a',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  flatlistContiner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
});

export default Main;
