import React from 'react';
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

type dataTypeList = {
  id: string;
  title: string;
};

export const DATA = [
  {
    id: '1',
    title: 'Dieter',
  },
  {
    id: '2',
    title: 'Elias',
  },
  {
    id: '3',
    title: 'Matias',
  },
];

const ListJugadores = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Lista de Jugadores</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity>
              {/*<Image 
                style={styles.image}
                source={require('../../assets/editar.png')}
          />*/}
            </TouchableOpacity>
            <TouchableOpacity>
              {/*<Image 
                style={styles.image}
                source={require('../../assets/resultados.png')}
        />*/}
            </TouchableOpacity>
            <TouchableOpacity>
              {/* <Image 
                style={styles.image}
                source={require('../../assets/eliminar.png')}
            /> */}
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item: dataTypeList) => item.id}
      />
      <View style={styles.mas}>
        <TouchableOpacity style={styles.button}>
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
  },
  title: {
    flex: 4,
    fontSize: 18,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 25,
    height: 25,
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
