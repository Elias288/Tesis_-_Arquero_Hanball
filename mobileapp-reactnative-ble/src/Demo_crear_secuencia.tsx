import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { Device } from 'react-native-ble-plx';

type secuencia = { id: string; ledId: string; time: string };

type crearSecuenciaProps = {
  connectedDevice: Device | undefined;
  sendData(device: Device, msg: string): Promise<void>;
};

const DemoCrearSecuenca = ({ connectedDevice, sendData }: crearSecuenciaProps) => {
  const [secuencia, setSecuencia] = useState<secuencia[]>();
  const [secuenciaFormateada, setsecuenciaFormateada] = useState<string>('');

  const pushSecuencia = (ledId: string, time: string) => {
    if (secuencia?.length) {
      setSecuencia([...secuencia, { id: `${secuencia.length + 1}`, ledId, time }]);
    } else {
      setSecuencia([{ id: '1', ledId, time }]);
    }
  };

  // ***************** da formato a la secuencia cada vez que se agrega un nuevo par *****************
  useEffect(() => {
    if (secuencia !== undefined)
      setsecuenciaFormateada(secuencia.map((item) => `${item.ledId},${item.time}`).join(';'));
  }, [secuencia]);

  const sendFormatedSecuencia = () => {
    if (connectedDevice) sendData(connectedDevice, secuenciaFormateada);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#bebebe', padding: 20 }}>
      <Text>Crear Demo_crear_secuencia</Text>
      <Text>{connectedDevice !== undefined ? 'Conectado' : 'No conectado'}</Text>

      <SecuenciaInput addSecuencia={pushSecuencia} />

      <Text>{secuenciaFormateada}</Text>
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
