import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import HeaderComponent from '../components/Header.component';
import ListarJugadoresComponent from '../components/ListarJugadores.component';
import { IconButton } from 'react-native-paper';
import { ListaJugadoresTabPages } from '../navigation/ListaJugadoresTab';

type propsType = NativeStackScreenProps<ListaJugadoresTabPages, 'ListaJugadores'>;

const ListaJugadoresPage = (props: propsType) => {
  const { navigation, route } = props;

  const gotoAgregarJug = () => {
    navigation.navigate('Agregar_Jug');
  };

  /* const [data, setData] = useState(DATA);
  if (jug) {
    setData((prevData) => [...prevData, { title: jug }]);
  } */

  return (
    <View style={styles.container}>
      <HeaderComponent title={'Lista de Jugadores'} />

      <ListarJugadoresComponent navigation={navigation} />

      <IconButton
        icon={'plus'}
        mode="contained"
        containerColor="#3CB371"
        iconColor="#fff"
        size={40}
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={gotoAgregarJug}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 4,
    fontSize: 18,
    marginLeft: 5,
  },
});

export default ListaJugadoresPage;
