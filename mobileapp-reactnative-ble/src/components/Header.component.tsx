import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useCustomBLEProvider } from '../utils/BLEProvider';

type headerProps = {
  back?: boolean;
  title?: string;
};

const HeaderComponent = (props: headerProps) => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    isScanningLoading,
    espConnectedStatus,
    BLEPowerStatus,
    disconnectFromDevice,
  } = useCustomBLEProvider();

  const BleStatus = () => {
    const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        scanAndConnectPeripherals();
      }
    };

    return (
      <View>
        {BLEPowerStatus ? (
          // si el esp está encendido
          <>
            {isScanningLoading ? (
              // si está escaneando
              <View style={{ marginHorizontal: 15 }}>
                <ActivityIndicator animating={true} color={'#fff'} />
              </View>
            ) : (
              // si no está escaneando
              <>
                {espConnectedStatus ? (
                  // si está conectado
                  <IconButton
                    iconColor="#fff"
                    icon={'bluetooth-connect'}
                    onPress={() => disconnectFromDevice()}
                  />
                ) : (
                  // si no está conectado
                  <IconButton
                    onPress={scanForDevices}
                    iconColor="#fff"
                    icon={'reload-alert'}
                    size={25}
                  />
                )}
              </>
            )}
          </>
        ) : (
          // si el esp está apagado
          <IconButton onPress={scanForDevices} iconColor={'#fff'} icon={'bluetooth-off'} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {props.back ? <Text>Back</Text> : <BleStatus />}
      <Text style={styles.textTitle}>{props.title}</Text>
      <IconButton iconColor="#fff" icon={'cog'} size={30}></IconButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3CB371',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  textTitle: {
    padding: 10,
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
