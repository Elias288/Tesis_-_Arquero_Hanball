import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabPages } from '../navigation/HomeTab';
import HeaderComponent from '../components/Header.component';
import { ActivityIndicator } from 'react-native-paper';
import { useCustomBLEProvider } from '../utils/BLEProvider';

type propsType = NativeStackScreenProps<HomeTabPages, 'Jugar'>;

const Jugar = (props: propsType) => {
  const { navigation, route } = props;
  const { rutina } = route.params;
  const {sendData} = useCustomBLEProvider()
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      <HeaderComponent title="Iniciar Rutina" />
      <View style={styles.container}>
        <Text>{JSON.stringify(rutina, null, 0)}</Text>
        <ActivityIndicator animating={true} color={'#a9a9a9'} size={150} />
      </View>
    </>
  );
};

export default Jugar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    width: 350,
    flexDirection: 'row',
  },
  title: {
    flex: 4,
    fontSize: 18,
  },
});
