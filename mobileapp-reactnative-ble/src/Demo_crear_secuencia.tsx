import { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useCustomBLEProvider } from './utils/BLEProvider';
import { SelectList } from 'react-native-dropdown-select-list';

type secuencia = { id: string; ledId: string; time: number };

const DemoCrearSecuenca = () => {
  const [secuencia, setSecuencia] = useState<secuencia[]>([]);
  const [secuenciaFormateada, setsecuenciaFormateada] = useState<string>('');

  const { sendData, connectedDevice } = useCustomBLEProvider();

  const pushSecuencia = (ledId: string, time: string) => {
    if (secuencia?.length) {
      setSecuencia([...secuencia, { id: `${secuencia.length + 1}`, ledId, time: +time }]);
    } else {
      setSecuencia([{ id: '1', ledId, time: +time }]);
    }
  };

  const cleanSecuencia = () => {
    setSecuencia([]);
    setsecuenciaFormateada('');
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

      <SecuenciaInput addSecuencia={pushSecuencia} cleanSecuencia={cleanSecuencia} />

      <View style={{ padding: 20 }}>
        <FlatList
          data={secuencia}
          renderItem={({ item }) => (
            <Text>
              Led: {+item.ledId + 1} - Time: {item.time/1000}s
            </Text>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      {/* <Text style={{ padding: 20 }}>{}</Text> */}
      {/* <Text>{JSON.stringify(secuencia, null, 4)}</Text> */}
      <Button mode="contained" onPress={sendFormatedSecuencia}>
        Enviar
      </Button>
    </View>
  );
};

// ******************************** FORMULARIO PARA AGREGAR SECUENCIA ********************************
interface SecuenciaInputProps {
  addSecuencia: (ledId: string, time: string) => void;
  cleanSecuencia: () => void;
}

interface selectedItem {
  key: string;
  value: number;
  disabled: boolean;
}

const SecuenciaInput = (props: SecuenciaInputProps) => {
  const { addSecuencia, cleanSecuencia } = props;
  const [ledsIdList, setLedsIdList] = useState<Array<selectedItem>>([]);
  const [secondsList, setSecondsList] = useState<Array<selectedItem>>([]);

  const [ledIdSelected, setLedIdSelected] = useState<string>('');
  const [secondSelected, setSecondSelected] = useState<string>('');

  const createSecuencia = () => {
    if (ledIdSelected.trim() !== '') {
      addSecuencia(ledIdSelected, secondSelected);
      setLedIdSelected('');
      setSecondSelected('');
    }
  };

  const chargeLedList = () => {
    const ledsIdList = [];
    for (let i = 1; i <= 4; i++) {
      ledsIdList.push({ key: `${i}`, value: i, disabled: false });
    }
    setLedsIdList(ledsIdList);
  };
  const chargeSecondsList = () => {
    const secondsList = [];
    for (let i = 1; i <= 10; i++) {
      secondsList.push({ key: `${i}`, value: i, disabled: false });
    }
    setSecondsList(secondsList);
  };

  useEffect(() => {
    chargeLedList();
    chargeSecondsList();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: 10,
      }}
    >
      <SelectList
        setSelected={(ledId: number) => setLedIdSelected(`${ledId - 1}`)}
        data={ledsIdList}
        placeholder="Led"
        search={false}
      />
      <SelectList
        setSelected={(second: number) => setSecondSelected(`${second * 1000}`)}
        data={secondsList}
        placeholder="Seconds"
        search={false}
      />
      <Button
        mode="contained"
        onPress={createSecuencia}
        style={{ borderRadius: 0, marginLeft: 10 }}
      >
        Add
      </Button>

      <Button mode="contained" onPress={cleanSecuencia} style={{ borderRadius: 0, marginLeft: 10 }}>
        Clean
      </Button>
    </View>
  );
};

export default DemoCrearSecuenca;
