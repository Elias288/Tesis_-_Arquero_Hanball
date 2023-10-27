import React from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InicioTabPages } from '../navigation/InicioTab';
import HeaderComponent from '../components/Header.component';
import GlobalStyles from '../utils/EstilosGlobales';

type propsType = NativeStackScreenProps<InicioTabPages, 'Hist_Jugadores'>;

const Hist_Jugadores = (props: propsType) => {
  const { navigation, route } = props;
  const { name } = route.params;

  return (
    <>
      <HeaderComponent title={'Historial'} />
      <View style={styles.container}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Historial de entrenamientos de:</Text>
          <Text style={styles.heading}>{name}</Text>
        </View>
        <View style={styles.containerList}>
          <View style={styles.container10}>
            <View style={styles.container11}>
              <Text style={styles.bigText}>Última rutina</Text>
              <Text style={styles.text}>Info de última rutina</Text>
            </View>
            <View style={styles.containerDate}>
              <Text style={styles.smallText}>DD/MM/YYYY</Text>
            </View>
          </View>
          <View style={styles.container10}>
            <View style={styles.container11}>
              <Text style={styles.bigText}>Penúltima rutina</Text>
              <Text style={styles.text}>Info de penúltima rutina</Text>
            </View>
            <View style={styles.containerDate}>
              <Text style={styles.smallText}>DD/MM/YYYY</Text>
            </View>
          </View>
          <View style={styles.container10}>
            <View style={styles.container11}>
              <Text style={styles.bigText}>Ante-penúltima rutina</Text>
              <Text style={styles.text}>Info de ante-penúltima rutina</Text>
            </View>
            <View style={styles.containerDate}>
              <Text style={styles.smallText}>DD/MM/YYYY</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Hist_Jugadores;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTitle: {
    flex: 1,
  },
  containerList: {
    flex: 5,
    backgroundColor: GlobalStyles.white,
    width: Dimensions.get('window').width - 40,
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container10: {
    //flex:1,
    justifyContent: 'space-around',
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: GlobalStyles.white,
  },
  container11: {
    flex: 4,
    // justifyContent: 'space-around',
    marginLeft: 5,
  },
  containerDate: {
    flex: 1,
    marginRight: 2,
  },
  text: {
    fontSize: 15,
    color: '#444444',
    padding: 5,
  },
  bigText: {
    fontSize: 27,
  },
  smallText: {
    fontSize: 10,
  },
});
