import { IconButton, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import BleStatus from './BleStatus';
import Constants from 'expo-constants';

const HeaderComponent = ({ ...props }) => {
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
