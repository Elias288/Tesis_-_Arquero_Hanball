import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { stackScreens } from '../components/AllScreens';
import HeaderComponent from '../components/Header.component';

type propsType = NativeStackScreenProps<stackScreens, 'HomePage'>;

const HomePage = (props: propsType) => {
  const { navigation, route } = props;

  const gotoSecuencias = () => {
    navigation.navigate('Secuencias');
  };
  const gotoAgregarJug = () => {
    navigation.navigate('Agregar_Jug');
  };
  const gotoCrearSecuencia = () => {
    navigation.navigate('DemoCrearSecuenca');
  };

  return (
    <>
      <HeaderComponent title={'BLE App'} />
      <View style={styles.container}>
        {/*<ScrollView showsVerticalScrollIndicator={true}>*/}
        <View style={styles.ind_container1}>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Iniciar Rutina</Text>
          </View>
          <View style={styles.container2}>
            <View style={styles.container3}>
              <Text style={styles.text}>{`\u25CF Última rutina realizada + info relevante`}</Text>
              <Text
                style={styles.text}
              >{`\u25CF Muestra mensaje de estado de conexión del ESP`}</Text>
            </View>
            <View style={styles.container4}>
              <View style={styles.container5}>
                <TouchableOpacity>
                  <Icon name="dice-5" size={30} color="#3CB371" />
                </TouchableOpacity>
                <Text style={styles.text}>Rutina Aleatoria</Text>
              </View>
              <View style={styles.container5}>
                <TouchableOpacity onPress={gotoCrearSecuencia}>
                  <Icon name="plus-circle" size={30} color="#3CB371" />
                </TouchableOpacity>
                <Text style={styles.text}>Crear rutina</Text>
              </View>
              <View style={styles.container5}>
                <TouchableOpacity onPress={gotoSecuencias}>
                  <Icon name="upload" size={30} color="#3CB371" />
                </TouchableOpacity>
                <Text style={styles.text}>Cargar rutina</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.ind_container2}>
          <View style={styles.container5}>
            <TouchableOpacity onPress={gotoAgregarJug}>
              <Icon name="plus-circle" size={30} color="#3CB371" />
            </TouchableOpacity>
            <Text style={styles.title}>Agregar Jugador</Text>
          </View>
        </View>
        <View style={styles.ind_container3}>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Historial de rutinas</Text>
          </View>
          <View style={styles.container6}>
            <View style={styles.container7}>
              <Text style={styles.bigText}>0</Text>
              <Text style={styles.text}>{`Entrenamientos en \n la semana`}</Text>
            </View>
            <View style={styles.container9}>
              <Text style={styles.bigText}>0h</Text>
              <Text style={styles.text}>{`Duración total \n entrenamientos \n de  la semana`}</Text>
            </View>
          </View>
          <View style={styles.container8}>
            <View style={styles.container10}>
              <View style={styles.containerPhoto}>
                <Icon name="circle" size={50} color="#3CB371" />
              </View>
              <View style={styles.container11}>
                <Text style={styles.bigText}>Nombre Jugador</Text>
                <Text style={styles.text}>Info del jugador</Text>
              </View>
              <View style={styles.containerDate}>
                <Text style={styles.smallText}>DD/MM/YYYY</Text>
              </View>
            </View>
            <View style={styles.container10}>
              <View style={styles.containerPhoto}>
                <Icon name="circle" size={50} color="#3CB371" />
              </View>
              <View style={styles.container11}>
                <Text style={styles.bigText}>Nombre Jugador</Text>
                <Text style={styles.text}>Info del jugador</Text>
              </View>
              <View style={styles.containerDate}>
                <Text style={styles.smallText}>DD/MM/YYYY</Text>
              </View>
            </View>
            <View style={styles.container10}>
              <View style={styles.containerPhoto}>
                <Icon name="circle" size={50} color="#3CB371" />
              </View>
              <View style={styles.container11}>
                <Text style={styles.bigText}>Nombre Jugador</Text>
                <Text style={styles.text}>Info del jugador</Text>
              </View>
              <View style={styles.containerDate}>
                <Text style={styles.smallText}>DD/MM/YYYY</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 1 }}>
            <TouchableOpacity>
              <Text style={styles.text}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*</ScrollView>*/}
      </View>
    </>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  container: {
    //marginTop:'20%',
    //justifyContent:'center',
    alignItems: 'center',
    flex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  ind_container1: {
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width - 40,
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
    flex: 3,
  },
  ind_container2: {
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width - 40,
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ind_container3: {
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width - 40,
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
    flex: 6,
  },
  containerTitle: {
    flex: 2,
    justifyContent: 'center',
    borderColor: '#dcdcdc',
    borderBottomWidth: 1,
  },
  container2: {
    flex: 8,
    flexDirection: 'row',
  },
  container3: {
    flex: 1,
    justifyContent: 'space-around',
    borderColor: '#dcdcdc',
    borderRightWidth: 1,
  },
  container4: {
    flex: 1,
    justifyContent: 'space-around',
  },
  container5: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  container6: {
    flex: 3,
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#E2E2E2',
  },
  container7: {
    alignItems: 'center',
    flex: 5,
    borderColor: '#D1D1D1',
    borderRightWidth: 1,
  },
  container8: {
    flex: 8,
    //flexDirection: 'row',
    margin: 5,
  },
  container9: {
    alignItems: 'center',
    flex: 5,
  },
  container10: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 5,
    flexDirection: 'row',
  },
  container11: {
    flex: 4,
    // justifyContent: 'space-around',
    marginLeft: 5,
  },
  containerPhoto: {
    flex: 1,
  },
  containerDate: {
    flex: 1,
    marginRight: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    height: 'auto',
    marginLeft: 10,
    color: '#444444',
    //backgroundColor: "#ffffff"
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

export default HomePage;
