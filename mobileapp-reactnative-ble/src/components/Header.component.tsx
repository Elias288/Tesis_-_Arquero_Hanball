import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useCustomBLEProvider } from '../utils/BLEProvider';

type headerProps = {
  back?: boolean;
  title?: string;
};

const HeaderComponent = (props: headerProps) => {
  const BleStatus = () => {
    const { requestPermissions, scanAndConnectPeripherals, isScanningLoading } =
      useCustomBLEProvider();

    const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        scanAndConnectPeripherals();
      }
    };

    return (
      <View>
        {isScanningLoading ? (
          <View style={{ marginHorizontal: 15 }}>
            <ActivityIndicator animating={true} color={'#fff'} />
          </View>
        ) : (
          <TouchableOpacity onPress={scanForDevices}>
            <IconButton iconColor="#fff" icon={'reload-alert'} size={25} />
          </TouchableOpacity>
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
