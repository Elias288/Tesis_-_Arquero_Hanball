import { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useCustomBLE } from '../contexts/BLEProvider';
import uuid from 'react-native-uuid';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BLUETOOTHCONNECTED, BLUETOOTHNOTSTATUS } from './BleCodes';
import { RutinaTabPages } from '../navigation/RutinasTab';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { RootTabs } from '../Main';
import { HomeTabs } from '../navigation/HomeTab';

export interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

const HandleMSGs = () => {
  const navigator =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<RutinaTabPages>,
        NativeStackNavigationProp<HomeTabs>
      >
    >();

  const { receivedMSG, BLECode, BLEmsg, runGame, stringToSecuencia, selectRutina, selectedRutina } =
    useCustomBLE();
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

      if (selectedRutina) {
        const rut = selectedRutina;
        selectRutina(undefined);

        rut.secuencia.map((sec) => {
          sec.resTime = secuenciaRecibida.find((result) => result.id === sec.id)?.resTime;
        });

        pushRutinaRealizada({
          ...rut,
          id: uuid.v4().toString().replace(/-/g, ''),
          title: 'Rutina ' + (rutinasRealizadas.length + 1),
        });

        console.log(rut);

        navigator?.navigate('Rutinas', {
          screen: 'ViewRutinaResultado',
          params: { rutina: JSON.stringify(rut) },
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
