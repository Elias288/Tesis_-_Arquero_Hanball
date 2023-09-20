import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { BleError, Device } from 'react-native-ble-plx';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { stackScreens } from '../Main';
import useBLE from '../components/useBLE';
import { View } from 'react-native';
import { useCustomBLE } from '../utils/BLEProvider';

type propsType = NativeStackScreenProps<stackScreens, 'Home'>;

const Home = (props: propsType) => {
  const { navigation, route } = props;
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    connectToDevice,
    sendData,
    BLEmsg,
    connectedDevice,
    espStatus,
  } = useCustomBLE();

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (espStatus) {
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
    if (connectedDevice !== undefined) {
      connectToDevice(connectedDevice);
    }
  };

  const sendDataToEsp = () => {
    if (connectedDevice) {
      sendData(connectedDevice, message);
    }
  };

  return (
    <PaperProvider>
      <Button onPress={() => scanForDevices()}>Scan</Button>
      {connectedDevice ? <Button onPress={() => disconnectFromDevice()}>Disconnect</Button> : ''}

      <View style={{ alignItems: 'center' }}>
        <Text>{connectedDevice !== undefined ? 'Conectado' : 'No conectado'}</Text>
        <Text>{`${BLEmsg}`}</Text>
      </View>

      <Text>Home</Text>
    </PaperProvider>
  );
};

export default Home;
