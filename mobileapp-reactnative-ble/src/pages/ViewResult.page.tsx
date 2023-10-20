import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabPages } from '../navigation/HomeTab';
import HeaderComponent from '../components/Header.component';

type propsType = NativeStackScreenProps<HomeTabPages, 'ViewResult'>;

const ViewResultPage = (props: propsType) => {
  const { navigation, route } = props;
  const { res } = route.params;

  return (
    <>
      <HeaderComponent title="Ver resultado" back={true} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Seleccionar secuencia para: {res}</Text>
      </SafeAreaView>
    </>
  );
};

export default ViewResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 4,
    fontSize: 18,
  },
});
