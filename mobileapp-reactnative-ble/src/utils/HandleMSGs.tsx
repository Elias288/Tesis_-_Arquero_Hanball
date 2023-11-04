import { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useCustomBLE } from '../contexts/BLEProvider';
import uuid from 'react-native-uuid';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BLUETOOTHCONNECTED, BLUETOOTHNOTSTATUS } from './BleCodes';
import { RutinaTabPages } from '../navigation/RutinasTab';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { HomeTabs } from '../navigation/HomeTab';
import { secuenciaType } from '../data/RutinasType';
import { ResultadoType } from '../data/ResultadoType';

export interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

type navigationType = CompositeNavigationProp<
  NativeStackNavigationProp<RutinaTabPages>,
  NativeStackNavigationProp<HomeTabs>
>;

const HandleMSGs = () => {
  const navigator = useNavigation<navigationType>();

  const {
    receivedMSG,
    BLECode,
    BLEmsg,
    runGame,
    stringToSecuencia,
    selectRutina,
    selectedJugador,
    selectedRutina,
  } = useCustomBLE();
  const { pushRutinaRealizada, rutinasRealizadas } = useCustomLocalStorage();
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMsg, SetsnackbarMsg] = useState<string>('Hola');

  useEffect(() => {
    // si recibe un mensaje desde el servidor BLE
    if (receivedMSG) {
      runGame(false);
      // convierte el mensaje en funcion:dato
      const partes = receivedMSG.split('^');
      partes.forEach((parte) => {
        const [nombreFuncion, dato] = parte.split(':');
        const funcion = handleFunctions[nombreFuncion];
        if (funcion) {
          funcion(dato);
        }
      });
    }

    // si hay un codigo de error
    if (BLECode !== BLUETOOTHCONNECTED && BLECode !== BLUETOOTHNOTSTATUS) {
      setVisibleSnackbar(true);
      SetsnackbarMsg(`${BLECode}: ${BLEmsg}`);
      // cleanBLECode();
    }
  }, [BLECode, receivedMSG]);

  const handleFunctions: Funciones = {
    // resultado del juego
    res: (secuenciaStringRecibida) => {
      const secuenciaRecibida = stringToSecuencia(secuenciaStringRecibida);

      if (selectedRutina && selectedJugador) {
        const secuenciasDeRutinaSeleccionada: secuenciaType[] = selectedRutina.secuencias;
        selectRutina(undefined);

        // a las secuencias de la rutina seleccionada se le agregan los tiempos recibidos
        secuenciasDeRutinaSeleccionada.map((secuencia) => {
          secuencia.resTime = secuenciaRecibida.find((result) => result.id === secuencia.id)
            ?.resTime;
        });

        const title =
          'Rutina - ' +
          new Date().getDate().toString().padStart(2, '0') +
          (new Date().getMonth() + 1).toString().padStart(2, '0') +
          new Date().getFullYear().toString().slice(-2) +
          new Date().getHours().toString().padStart(2, '0') +
          new Date().getMinutes().toString().padStart(2, '0');

        const newRutinaRealizada: ResultadoType = {
          _id: uuid.v4().toString().replace(/-/g, ''),
          createDate: selectedRutina.fechaDeCreación,
          id_jugador: selectedJugador._id,
          id_rutina: selectedRutina._id,
          secuencias: secuenciasDeRutinaSeleccionada,
          titulo: title,
          playedDate: new Date(),
        };

        pushRutinaRealizada(newRutinaRealizada);

        navigator?.navigate('Rutinas', {
          screen: 'ViewRutinaResultado',
          params: { rutina: JSON.stringify(newRutinaRealizada) },
        });
      }
    },

    // mensajes desde desde el servidor BLE
    bleMSG: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
    },
  };

  return (
    <Portal>
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        action={{
          label: 'Undo',
          onPress: () => {
            setVisibleSnackbar(false);
          },
        }}
      >
        {snackbarMsg}
      </Snackbar>
    </Portal>
  );
};

export default HandleMSGs;
