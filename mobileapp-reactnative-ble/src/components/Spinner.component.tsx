import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import HeaderComponent from './Header.component';

const Spinner = () => {
  return (
    <>
      <HeaderComponent title={'BLE App'} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={true} color={'#a9a9a9'} size={150} />
      </View>
    </>
  );
};

export default Spinner;
