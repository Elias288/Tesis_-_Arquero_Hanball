import React, { FC, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";

import useBLE from "./components/useBLE";
import { Device } from "react-native-ble-plx";
import { Button } from "react-native-paper";

/************************************************* Main *************************************************/
const Main = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { requestPermissions, scanForPeripherals, allDevices } = useBLE();

  useEffect(() => {
    scanForDevices();
  }, []);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  return (
    <View style={styles.container}>
      <Text>Mobile App - React Native - BLE</Text>

      {/* <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Connect</Text>
            </TouchableOpacity> */}

      <ShowDevices devices={allDevices} connectToPeripheral={() => {}} />
    </View>
  );
};

/******************************************** SHOW DEVICES *********************************************/
type DeviceModalProps = {
  devices: Device[];
  connectToPeripheral: (device: Device) => void;
};
const ShowDevices: FC<DeviceModalProps> = (props) => {
  const { devices, connectToPeripheral } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return <Text>{item.item.name}</Text>;
    },
    [connectToPeripheral]
  );

  return (
    <View>
      <Button>Reload</Button>
      <FlatList
        contentContainerStyle={styles.flatlistContiner}
        data={devices}
        renderItem={renderDeviceModalListItem}
      />
    </View>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 20,
    backgroundColor: "#fff",
  },
  ctaButton: {
    backgroundColor: "#1aa70a",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  flatlistContiner: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
});

export default Main;
