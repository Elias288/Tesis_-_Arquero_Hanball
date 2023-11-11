import { Slider } from '@react-native-assets/slider';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import uuid from 'react-native-uuid';

import { inicioTabPages } from '../navigation/InicioTab';
import { RootTabs } from '../Main';
import { RutinaType, secuenciaType } from '../data/RutinasType';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import GlobalStyles from '../utils/EstilosGlobales';

const CANTLEDS = 4;
const MAXSECONDS = 5;

type navigationType = CompositeNavigationProp<
  NativeStackNavigationProp<inicioTabPages, 'InicioPage', undefined>,
  NativeStackNavigationProp<RootTabs>
>;

type propsType = {
  visible: boolean;
  setVisibleDialogCreateRandom: (val: boolean) => void;
};

const CrearRutinaAleatoriaComponent = (props: propsType) => {
  const { setVisibleDialogCreateRandom, visible } = props;
  const { rutinas } = useCustomLocalStorage();
  const navigator = useNavigation<navigationType>();
  const [randomSize, setRandomSize] = useState<number>(4);

  const CustomThumb = ({ value }: { value: number }) => {
    return <Text style={styles.CustomThumb}>{value}</Text>;
  };

  const gotoJugar = (secuencias: Array<secuenciaType>) => {
    const rutina: RutinaType = {
      _id: uuid.v4().toString().replace(/-/g, ''),
      titulo: 'rutina random ' + uuid.v4().toString().replace(/-/g, ''),
      secuencias: JSON.stringify(secuencias),
      fechaDeCreación: new Date(),
      // TODO: obtener id del usuario logueado
      id_usuario: '',
    };
    navigator?.navigate('Jugar', { rutina: JSON.stringify(rutina) });
  };

  const crearRutinaAleatoria = () => {
    /*
     * Esta función debe generar una lista de rutinas de un tamaño dado por el usuario, que dependa de la cantidad
     * de E/R conectados y de un maximo de 5 segundos.
     */
    let rutina: Array<secuenciaType> = [];
    let previousLedId = 0; // Inicializado a 0 para asegurar que no coincida con el primer valor

    for (let i = 0; i <= randomSize - 1; i++) {
      let randomLedId;

      // evita que se repitan consecutivamente 2 leds
      do {
        randomLedId = Math.floor(Math.random() * CANTLEDS) + 1; // Número aleatorio entre 1 y 4
      } while (randomLedId == previousLedId);
      previousLedId = randomLedId;

      const randomTime = Math.floor(Math.random() * MAXSECONDS) + 1; // Número aleatorio entre 1 y 5

      // construye el objeto Rutina
      const newSecuencia: secuenciaType = {
        id: i.toString(),
        ledId: randomLedId.toString(),
        tiempo: randomTime,
      };

      // carga la lista de Rutinas
      rutina.push(newSecuencia);
    }

    setRandomSize(4);
    setVisibleDialogCreateRandom(false);
    gotoJugar(rutina);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisibleDialogCreateRandom(false)}>
        <Dialog.Content>
          <View style={{ paddingTop: 20 }}>
            <Text style={styles.title}>Crear rutina aleatoria</Text>

            <View style={{ marginTop: 10 }}>
              <Text>Cantidad de secuencias</Text>
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
    color: GlobalStyles.white,
    textAlign: 'center',
  },
});

export default CrearRutinaAleatoriaComponent;
