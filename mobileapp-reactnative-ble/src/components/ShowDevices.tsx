import { FC, useCallback } from 'react';
import {
  FlatList,
  Text,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Device } from 'react-native-ble-plx';

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
  }, [connectToPeripheral, item.item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal}>
      <Text>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

type DeviceModalProps = {
  devices: Device[];
  connectToPeripheral: (device: Device) => void;
};

const ShowDevices: FC<DeviceModalProps> = (props) => {
  const { devices, connectToPeripheral } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return <DeviceModalListItem item={item} connectToPeripheral={connectToPeripheral} />;
    },
    [connectToPeripheral]
  );

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={styles.flatlistContiner}
        data={devices}
        renderItem={renderDeviceModalListItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatlistContiner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
});

export default ShowDevices;
