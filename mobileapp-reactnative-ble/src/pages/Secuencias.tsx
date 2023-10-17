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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../components/Header.component';
import { IconButton } from 'react-native-paper';

import { SecuenciasTabPages } from '../navigation/SecuenciasTab';
import ListarSecuenciasComponent from '../components/Secuencias.component';

type propsType = NativeStackScreenProps<SecuenciasTabPages, 'Secuencias'>;

const Secuencias = (props: propsType) => {
  const { navigation, route } = props;

  const gotoAgregarSecuencia = () => {
    navigation.navigate('CrearSecuencaDef');
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title={'Rutinas'} />
      <ListarSecuenciasComponent navigation={navigation} />
      <View>
        <IconButton
          icon={'plus'}
          mode="contained"
          containerColor="#e7d84f"
          iconColor="#fff"
          size={40}
          style={{ position: 'absolute', right: 20, bottom: 20 }}
          onPress={gotoAgregarSecuencia}
        />
      </View>
    </View>
  );
};

export default Secuencias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
