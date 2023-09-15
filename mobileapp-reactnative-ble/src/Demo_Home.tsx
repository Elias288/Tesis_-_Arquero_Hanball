import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, PaperProvider, TextInput } from 'react-native-paper';

import useBLE from './components/useBLE';

const DemoHome = () => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    connectToDevice,
    sendData,
    BLEmsg,
    espDevice,
    connectedDevice,
    espStatus,
  } = useBLE();

  const [message, setmessage] = useState<string>('');

  useEffect(() => {
    if (!espStatus) {
      scanForDevices();
    }
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
        <Button onPress={() => scanForDevices()}>Scan</Button>

        {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}
        {/* {!connectedDevice ?? <Button onPress={connect}>Conect</Button>} */}

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
      </View>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default DemoHome;
