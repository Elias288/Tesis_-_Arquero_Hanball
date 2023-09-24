import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';

import Main from './src/Main';
import BleContext from './src/utils/BLEProvider';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <BleContext>
        <Main />
        <StatusBar style="auto" />
      </BleContext>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
