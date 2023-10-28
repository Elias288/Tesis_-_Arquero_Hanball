import HeaderComponent from '../components/Header.component';
import { View, StyleSheet } from 'react-native';
import ListarRutinasComponent from '../components/ListarRutinas.component';
import { Button } from 'react-native-paper';
import GlobalStyles from '../utils/EstilosGlobales';
import { RutinaTabPages } from '../navigation/RutinasTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import sortType from '../utils/sortType';

type propsType = NativeStackScreenProps<RutinaTabPages, 'RutinasRealizadas'>;

const RutinasRealizadasPage = (props: propsType) => {
  const { navigation, route } = props;
  const { clearRutinasRealizadas } = useCustomLocalStorage();

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
            style={{ borderColor: GlobalStyles.yellowBorderColor, flex: 1 }}
            onPress={goToRutinas}
          >
            Rutinas
          </Button>
          <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={{ borderColor: GlobalStyles.yellowBorderColor, flex: 2 }}
            disabled={true}
          >
            Ver Rutinas realizadas
          </Button>
          {/* <Button
            mode="outlined"
            buttonColor={GlobalStyles.yellowBackColor}
            textColor={GlobalStyles.yellowTextColor}
            style={{ borderColor: GlobalStyles.yellowBorderColor, flex: 1 }}
            onPress={clearRutinasRealizadas}
          >
            limpiar
          </Button> */}
        </View>

        <View style={{ flex: 1 }}>
          <ListarRutinasComponent
            listRutinasRealizadas={true}
            simpleList={true}
            sort={sortType.newestFirst}
          />
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
