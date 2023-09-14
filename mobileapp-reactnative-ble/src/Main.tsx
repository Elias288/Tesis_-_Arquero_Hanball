import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import useBLE from './components/useBLE';
import { Button, PaperProvider, TextInput } from 'react-native-paper';

/************************************************* Main *************************************************/
const Main = () => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    connectToDevice,
    sendData,
    BLEmsg,
    espDevice,
    connectedDevice,
  } = useBLE();

  const [message, setmessage] = useState<string>('');

  useEffect(() => {
    scanForDevices();
  }, []);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
    }
  };

  const connect = () => {
    if (espDevice !== undefined) {
      connectToDevice(espDevice);
    }
  };

  const sendDataToEsp = () => {
    if (espDevice) {
      sendData(espDevice, message);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Mobile App - React Native - BLE</Text>

        <Button onPress={() => scanForDevices()}>Scan</Button>

        {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}
        {!connectedDevice ?? <Button onPress={connect}>Conect</Button>}

        <View style={{ alignItems: 'center' }}>
          <Text>{connectedDevice !== null ? 'Conectado' : 'No conectado'}</Text>
          <Text>{`${BLEmsg}`}</Text>
        </View>

        <TextInput
          style={{ marginHorizontal: 20 }}
          value={message}
          onChangeText={(newMessage) => setmessage(newMessage)}
        />
        <Button onPress={() => sendDataToEsp()}>Send</Button>

        {/* <ScrollView>
          <Text>{JSON.stringify(espDevice, null, 4)}</Text>
        </ScrollView> */}
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
