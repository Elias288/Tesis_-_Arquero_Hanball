import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { PaperProvider } from 'react-native-paper';
import DemoHome from './Demo_Home';

/************************************************* Main *************************************************/
const Main = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Mobile App - React Native - BLE</Text>
        <DemoHome />
      </View>
    </PaperProvider>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 20,
    backgroundColor: '#dbdbdb',
  },
});

export default Main;
