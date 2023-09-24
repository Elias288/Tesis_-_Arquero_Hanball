import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BleError, Device } from 'react-native-ble-plx';
import { stackScreens } from './Main';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCustomBLEProvider } from './utils/BLEProvider';
import DemoCrearSecuenca from './Demo_crear_secuencia';

type propsType = NativeStackScreenProps<stackScreens, 'Home'>;
const DemoHome = (props: propsType) => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    sendData,
    connectedDevice,
    BLEmsg,
    espStatus,
    receivedMSG,
  } = useCustomBLEProvider();

  const [message, setmessage] = useState<string>('');

  // ********************************** al iniciar escanea y conecta **********************************
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

  const sendDataToEsp = () => {
    if (connectedDevice) {
      sendData(connectedDevice, message);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Button onPress={() => scanForDevices()}>Scan</Button>

        {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}

        <View style={{ alignItems: 'center' }}>
          <Text>{connectedDevice !== undefined ? 'Conectado' : 'No conectado'}</Text>
          <Text>{`${BLEmsg}`}</Text>
          <Text>received msg: {receivedMSG}</Text>
        </View>

        <View style={styles.msgContainer}>
          <TextInput
            style={{ marginHorizontal: 20, flex: 1 }}
            value={message}
            placeholder="Mensaje"
            onChangeText={(newMessage) => setmessage(newMessage)}
          />

          <Button mode="contained" onPress={() => sendDataToEsp()}>
            Send
          </Button>
        </View>
      </View>
      <DemoCrearSecuenca />
    </>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dbdbdb',
  },
  msgContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#bebebe',
    alignItems: 'center',
    marginBottom: 5,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DemoHome;
