import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from '../components/Header.component';

type dataTypeList = {
  id: string;
  title: string;
};

export const DATA_S = [
  {
    id: '1',
    title: 'Secuencia 1',
  },
  {
    id: '2',
    title: 'Secuencia 2',
  },
  {
    id: '3',
    title: 'Secuencia 3',
  },
];

const Secuencias = () => {
  return (
    <>
      <HeaderComponent title={'Rutinas'} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Secuencias Guardadas</Text>
        <FlatList
          data={DATA_S}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.icon}>
                <Icon name="application-edit-outline" size={30} color="#3CB371" />
              </View>
              <View style={styles.icon}>
                <Icon name="trash-can" size={30} color="#3CB371" />
              </View>
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
    </>
  );
};

export default Secuencias;

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
