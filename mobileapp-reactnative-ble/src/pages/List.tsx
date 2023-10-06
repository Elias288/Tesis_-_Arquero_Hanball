import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { stackScreens } from '../components/AllScreens';

type propsType = NativeStackScreenProps<stackScreens, 'List'>;

type dataTypeList = {
  title: string;
};

export const DATA = [
  {
    title: 'Dieter',
  },
  {
    title: 'Elias',
  },
  {
    title: 'Matias',
  },
];

const ListJugadores = (props: propsType) => {
  const { navigation, route } = props;
  const { jug } = route.params || {};

  const gotoHist_Jugadores = (nomJug: string) => {
    navigation.navigate('Hist_Jugadores', { name: nomJug });
  };

  const gotoAgregarJug = () => {
    navigation.navigate('Agregar_Jug');
  };

  const [data, setData] = useState(DATA);
  if (jug) {
    setData((prevData) => [...prevData, { title: jug }]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Lista de Jugadores</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Icon name="circle" size={50} color="#3CB371" />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.icon}>
              <TouchableOpacity>
                <Icon name="account-edit" size={30} color="#3CB371" />
              </TouchableOpacity>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity onPress={() => gotoHist_Jugadores(item.title)}>
                <Icon name="clipboard-text-outline" size={30} color="#3CB371" />
              </TouchableOpacity>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity>
                <Icon name="trash-can" size={30} color="#3CB371" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.title}
      />
      <View style={styles.mas}>
        <TouchableOpacity style={styles.button} onPress={gotoAgregarJug}>
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 4,
    fontSize: 18,
    marginLeft: 5,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#3CB371',
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  mas: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ListJugadores;
