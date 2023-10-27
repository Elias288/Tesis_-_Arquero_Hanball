import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useCustomBLE } from '../contexts/BLEProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InicioTabPages } from '../navigation/InicioTab';

type headerProps = {
  showBackButton?: boolean;
  title?: string;
};

const HEADERSIZE = 50;

const HeaderComponent = (props: headerProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<InicioTabPages>>();

  const BackButton = () => {
    return (
      <View style={styles.action}>
        <IconButton
          icon={'arrow-u-left-top-bold'}
          iconColor="#fff"
          onPress={() => navigator.goBack()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View /* style={styles.action} */>
        {props.showBackButton ? <BackButton /> : <BleStatus />}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>{props.title}</Text>
      </View>

      <View style={{ width: 50, height: 50 }}></View>
    </View>
  );
};

const BleStatus = () => {
  const {
    requestPermissions,
    scanAndConnectPeripherals,
    isScanningLoading,
    espConnectedStatus,
    BLEPowerStatus,
    disconnectFromDevice,
  } = useCustomBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanAndConnectPeripherals();
    }
  };

  return (
    <View style={styles.action}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3CB371',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  action: {
    height: HEADERSIZE,
    width: HEADERSIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: HEADERSIZE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    display: 'flex',
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
