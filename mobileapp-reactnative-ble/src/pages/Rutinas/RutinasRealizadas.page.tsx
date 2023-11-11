import HeaderComponent from '../../components/Header/Header.component';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import sortType from '../../utils/sortType';
import GlobalStyles from '../../utils/EstilosGlobales';
import { RutinaTabPages } from '../../navigation/RutinasTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ListarRutinasRealizadasComponent from '../../components/ListarResultados/listarRutinasRelizadas.component';

type propsType = NativeStackScreenProps<RutinaTabPages, 'RutinasRealizadas'>;

const RutinasRealizadasPage = (props: propsType) => {
  const { navigation, route } = props;

  const goToRutinas = () => {
    navigation.navigate('RutinasPage');
  };

  return (
    <>
      <HeaderComponent title="Rutinas Realizadas" showBackButton={true} />
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.action}>
          <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={[GlobalStyles.buttonStyle, { flex: 1 }]}
            onPress={goToRutinas}
          >
            Rutinas
          </Button>
          <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={[GlobalStyles.buttonStyle, { flex: 2 }]}
            disabled={true}
          >
            Ver Rutinas realizadas
          </Button>
        </View>

        <View style={{ flex: 1 }}>
          <ListarRutinasRealizadasComponent simpleList={true} sort={sortType.lastplayedFirst} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GlobalStyles.grayBackground, padding: 20 },
  action: {
    backgroundColor: GlobalStyles.white,
    marginBottom: 10,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default RutinasRealizadasPage;
