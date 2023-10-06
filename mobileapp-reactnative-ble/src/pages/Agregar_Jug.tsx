import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextComponent,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { stackScreens } from '../components/AllScreens';
import { TextInput } from 'react-native';
import { Button } from 'react-native';

type propsType = NativeStackScreenProps<stackScreens, 'Agregar_Jug'>;

const Agregar_Jug = (props: propsType) => {
  const { navigation } = props;
  const gotoList_Jugadores = (nomJug: string) => {
    navigation.navigate('List', { jug: nomJug });
  };

  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Agregar jugador</Text>
      </View>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="Nombres"
          onChangeText={(name) => setName(name)}
        ></TextInput>
        <TextInput style={styles.textInput} placeholder="Apellidos"></TextInput>
      </View>
      <View style={styles.button}>
        <Button title="Agregar" color="#3CB371" onPress={() => gotoList_Jugadores(name)} />
      </View>
    </View>
  );
};

export default Agregar_Jug;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
  },
  button: {
    width: 200,
    borderRadius: 10,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#dcdcdc',
    width: 300,
    padding: 10,
    marginBottom: 5,
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
