import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

import Main from './src/Main';
import BleProvider from './src/contexts/BLEProvider';
import LocalStorageProvider from './src/contexts/LocalStorageProvider';
import RemoteStorageProvider from './src/contexts/RemoteStorageProvider';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RemoteStorageProvider>
        <LocalStorageProvider>
          <BleProvider>
            <Main />
            <StatusBar style="auto" />
          </BleProvider>
        </LocalStorageProvider>
      </RemoteStorageProvider>
    </SafeAreaView>
  );
}
