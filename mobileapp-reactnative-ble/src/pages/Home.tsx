import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { stackScreens } from '../Main';
import { View, StyleSheet } from 'react-native';
import { useCustomBLEProvider } from '../utils/BLEProvider';

type propsType = NativeStackScreenProps<stackScreens, 'Home'>;

const Home = (props: propsType) => {
  const { navigation, route } = props;

  const {
    requestPermissions,
    scanAndConnectPeripherals,
    disconnectFromDevice,
    BLEmsg,
    connectedDevice,
    espStatus,
  } = useCustomBLEProvider();

  useEffect(() => {
    if (espStatus) {
      scanForDevices();
    }
  }, []);

  const gotoList = () => {
    navigation.navigate('List');
  };
  const gotoJugar = () => {
    navigation.navigate('Jugar');
  };
  const gotoSecuencias = () => {
    navigation.navigate('Secuencias');
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
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

      <View style={styles.button}>
        <Button color="#3CB371" onPress={gotoJugar}>
          Jugar
        </Button>
      </View>
      <View style={styles.button}>
        <Button color="#3CB371" onPress={gotoList}>
          Lista de Jugadores
        </Button>
      </View>
      <View style={styles.button}>
        <Button color="#3CB371" onPress={gotoSecuencias}>
          Secuencias
        </Button>
      </View>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  button: {
    width: 200,
    margin: 10,
    borderRadius: 30,
  },
});

export default Home;
