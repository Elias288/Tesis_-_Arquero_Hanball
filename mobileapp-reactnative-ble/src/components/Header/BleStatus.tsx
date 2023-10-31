import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { useCustomBLE } from '../../contexts/BLEProvider';
import GlobalStyles from '../../utils/EstilosGlobales';
export const HEADERSIZE = 50;

export const BleStatus = () => {
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
    <View style={bleStatusStyles.action}>
      {BLEPowerStatus ? (
        // si el esp está encendido
        <>
          {isScanningLoading ? (
            // si está escaneando
            <View style={{ marginHorizontal: 15 }}>
              <ActivityIndicator animating={true} color={GlobalStyles.white} />
            </View>
          ) : (
            // si no está escaneando
            <>
              {espConnectedStatus ? (
                // si está conectado
                <IconButton
                  iconColor={GlobalStyles.white}
                  icon={'bluetooth-connect'}
                  onPress={() => disconnectFromDevice()}
                />
              ) : (
                // si no está conectado
                <IconButton
                  onPress={scanForDevices}
                  iconColor={GlobalStyles.white}
                  icon={'reload-alert'}
                  size={25}
                />
              )}
            </>
          )}
        </>
      ) : (
        // si el esp está apagado
        <IconButton
          onPress={scanForDevices}
          iconColor={GlobalStyles.white}
          icon={'bluetooth-off'}
        />
      )}
    </View>
  );
};
const bleStatusStyles = StyleSheet.create({
  action: {
    height: HEADERSIZE,
    width: HEADERSIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
