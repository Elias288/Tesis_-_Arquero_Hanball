import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';

import Main from './src/Main';
import BleProvider from './src/contexts/BLEProvider';
import LocalStorageProvider from './src/contexts/LocalStorageProvider';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LocalStorageProvider>
        <BleProvider>
          <Main />
          <StatusBar style="auto" />
        </BleProvider>
      </LocalStorageProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
