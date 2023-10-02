import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { Device } from 'react-native-ble-plx';
import { useCustomBLEProvider } from './utils/BLEProvider';

type secuencia = { id: string; ledId: string; time: number };

const DemoCrearSecuenca = () => {
  const [secuencia, setSecuencia] = useState<secuencia[]>([]);
  const [cont, setCont] = useState<number>(0);
  const [secuenciaFormateada, setsecuenciaFormateada] = useState<string>('');

  const { sendData, connectedDevice } = useCustomBLEProvider();

  const pushSecuencia = (ledId: string, time: string) => {
    if (secuencia?.length) {
      setSecuencia([...secuencia, { id: `${secuencia.length + 1}`, ledId, time: +time }]);
    } else {
      setSecuencia([{ id: '1', ledId, time: +time }]);
    }
  };

  // ***************** da formato a la secuencia cada vez que se agrega un nuevo par *****************
  useEffect(() => {
    if (secuencia !== undefined)
      setsecuenciaFormateada(secuencia.map((item) => `${item.ledId},${item.time}`).join(';'));
  }, [secuencia]);

  const sendFormatedSecuencia = async () => {
    if (connectedDevice) {
      sendData(connectedDevice, `secuence:${secuenciaFormateada};`);

      /* for(const par of secuencia) {
        await new Promise((resolve) => {
          setTimeout(resolve, par.time); // Espera el tiempo indicado
        });

        console.log(`send: par:${par.ledId},${par.time};`);
        sendData(connectedDevice, `par:${par.ledId},${par.time};`);
      }

      // if (cont == secuencia.length) {
        sendData(connectedDevice, `par:end`);
      // } */
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#bebebe', padding: 20 }}>
      <Text>Crear Demo_crear_secuencia</Text>
      <Text>{connectedDevice !== undefined ? 'Conectado' : 'No conectado'}</Text>

      <SecuenciaInput addSecuencia={pushSecuencia} />

      <Text>{JSON.stringify(secuencia, null, 4)}</Text>
      <Button mode="contained" onPress={sendFormatedSecuencia}>
        Enviar
      </Button>
    </View>
  );
};

// ******************************** FORMULARIO PARA AGREGAR SECUENCIA ********************************
interface SecuenciaInputProps {
  addSecuencia: (ledId: string, time: string) => void;
}

const SecuenciaInput = (props: SecuenciaInputProps) => {
  const { addSecuencia } = props;
  const [ledId, setLedId] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const createSecuencia = () => {
    if (ledId.trim() !== '') {
      addSecuencia(ledId, time);
      setLedId('');
      setTime('');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
      }}
    >
      <TextInput
        value={ledId}
        placeholder="Led id"
        onChangeText={(newSecuencia) => setLedId(newSecuencia)}
        keyboardType="numeric"
        style={{ flex: 1, padding: 0 }}
      />
      <TextInput
        value={time}
        placeholder="time (ms)"
        onChangeText={(newTime) => setTime(newTime)}
        keyboardType="numeric"
        style={{ flex: 1, marginLeft: 10, padding: 0 }}
      />
      <Button
        mode="contained"
        onPress={createSecuencia}
        style={{ borderRadius: 0, marginLeft: 10 }}
      >
        Add
      </Button>
    </View>
  );
};

export default DemoCrearSecuenca;
