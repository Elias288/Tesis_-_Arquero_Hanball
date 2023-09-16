import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BleError, Device } from 'react-native-ble-plx';

type homeProps = {
  requestPermissions(): Promise<boolean>;
  scanAndConnectPeripherals(): void;
  disconnectFromDevice: () => void;
  sendData(device: Device, msg: string): Promise<void>;
  connectedDevice: Device | undefined;
  BLEmsg: string | BleError;
  espStatus: Boolean;
};

const DemoHome = (props: homeProps) => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    sendData,
    connectedDevice,
    BLEmsg,
    espStatus,
  } = props;

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
    <View style={styles.container}>
      <Button onPress={() => scanForDevices()}>Scan</Button>

      {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}

      <View style={{ alignItems: 'center' }}>
        <Text>{connectedDevice !== undefined ? 'Conectado' : 'No conectado'}</Text>
        <Text>{`${BLEmsg}`}</Text>
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
