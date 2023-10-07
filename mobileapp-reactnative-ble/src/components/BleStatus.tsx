import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useCustomBLEProvider } from '../utils/BLEProvider';
import { useEffect, useState } from 'react';

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

export default BleStatus;
