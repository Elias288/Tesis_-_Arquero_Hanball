import { Slider } from '@react-native-assets/slider';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { HomeTabPages } from '../navigation/HomeTab';
import { RootTabs } from '../Main';
import { secuenciaType } from '../data/ListaRutinas.data';
import { useCustomBLEProvider } from '../utils/BLEProvider';

const CANTLEDS = 4;
const MAXSECONDS = 5;

type propsType = {
  visible: boolean;
  setVisibleDialogCreateRandom: (val: boolean) => void;
  navigation?: CompositeNavigationProp<
    NativeStackNavigationProp<HomeTabPages, 'HomePage', undefined>,
    NativeStackNavigationProp<RootTabs>
  >;
};

const CrearRutinaAleatoriaComponent = (props: propsType) => {
  const { setVisibleDialogCreateRandom, visible, navigation } = props;
  const [randomSize, setRandomSize] = useState<number>(4);
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLEProvider();

  const CustomThumb = ({ value }: { value: number }) => {
    return <Text style={styles.CustomThumb}>{value}</Text>;
  };

  const gotoJugar = (secuencia: Array<secuenciaType>) => {
    const rutina = { id: 1, title: 'rutina random', secuencia };

    navigation?.navigate('Jugar', { rutina });
  };

  const crearRutinaAleatoria = () => {
    /*
     * Esta función debe generar una lista de rutinas de un tamaño dado por el usuario, que dependa de la cantidad
     * de E/R conectados y de un maximo de 5 segundos.
     */
    let rutina: Array<secuenciaType> = [];
    let previousLedId = 0; // Inicializado a 0 para asegurar que no coincida con el primer valor

    for (let i = 1; i <= randomSize; i++) {
      let randomLedId;

      // evita que se repitan consecutivamente 2 leds
      do {
        randomLedId = Math.floor(Math.random() * CANTLEDS) + 1; // Número aleatorio entre 1 y 4
      } while (randomLedId == previousLedId);
      previousLedId = randomLedId;

      const randomTime = Math.floor(Math.random() * MAXSECONDS) + 1; // Número aleatorio entre 1 y 5

      // construye el objeto Rutina
      const newSecuencia = {
        id: i.toString(),
        ledId: randomLedId.toString(),
        time: randomTime,
      };

      // carga la lista de Rutinas
      rutina.push(newSecuencia);
    }

    setVisibleDialogCreateRandom(false);
    gotoJugar(rutina);
  };

  return (
    <Portal>
      <Dialog visible={visible}>
          {espConnectedStatus && BLEPowerStatus ? (
          <>
            <Dialog.Content>
              <View style={{ paddingTop: 20 }}>
                <Text style={styles.title}>Crear rutina aleatoria</Text>

                <View style={{ marginTop: 10 }}>
                  <Text>Tamaño de Rutina</Text>
                  <Slider
                    minimumValue={4}
                    maximumValue={10}
                    onValueChange={setRandomSize}
                    step={1}
                    CustomThumb={CustomThumb}
                    style={{ height: 40 }}
                  />
                </View>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={crearRutinaAleatoria}>Jugar</Button>
              <Button onPress={() => setVisibleDialogCreateRandom(false)}>Cancel</Button>
            </Dialog.Actions>
          </>
        ) : (
          <>
            <Dialog.Content>
              <View style={{ paddingTop: 20 }}>
                <Text style={styles.title}>Bluetooth no está conectado</Text>
                <Text>Enciendaló para poder generar una rutina aleatoria</Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisibleDialogCreateRandom(false)}>Ok</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  CustomThumb: {
    width: 20,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    color: '#fff',
    textAlign: 'center',
  },
});

export default CrearRutinaAleatoriaComponent;
