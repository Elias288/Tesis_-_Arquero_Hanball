import { Slider } from '@react-native-assets/slider';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Text } from 'react-native-paper';

const CANTLEDS = 4;
const MAXSECONDS = 5;

type propsType = {
  visible: boolean;
  setVisibleDialogCreateRandom: (val: boolean) => void;
};

type rutinaType = { id: string; ledId: string; time: number };

const CrearRutinaAleatoriaComponent = (props: propsType) => {
  const { setVisibleDialogCreateRandom, visible } = props;
  const [randomSize, setRandomSize] = useState<number>(4);

  const CustomThumb = ({ value }: { value: number }) => {
    return <Text style={styles.CustomThumb}>{value}</Text>;
  };

  /*
   * Esta función debe generar una lista de rutinas de un tamaño dado por el usuario, que dependa de la cantidad
   * de E/R conectados y de un maximo de 5 segundos.
   */
  const crearRutinaAleatoria = () => {
    let rutina: Array<rutinaType> = [];
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
      const jsonData = {
        id: i.toString(),
        ledId: randomLedId.toString(),
        time: randomTime,
      };

      // carga la lista de Rutinas
      rutina.push(jsonData);
    }

    alert(JSON.stringify(rutina, null, 2));
    setVisibleDialogCreateRandom(false);
  };

  return (
    <Dialog visible={visible}>
      <Dialog.Content>
        <View>
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
    </Dialog>
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
