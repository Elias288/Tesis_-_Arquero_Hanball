import { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useCustomBLEProvider } from './BLEProvider';
import { BLUETOOTHCONNECTED, BLUETOOTHNOTSTATUS } from './BleCodes';
import { useNavigation } from '@react-navigation/native';
import { HomeTabPages } from '../navigation/HomeTab';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Funciones {
  [nombreFuncion: string]: (dato: string) => void;
}

const HandleMSGs = () => {
  const navigator = useNavigation<NativeStackNavigationProp<HomeTabPages>>();

  const { receivedMSG, BLECode, BLEmsg, cleanBLECode } = useCustomBLEProvider();
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMsg, SetsnackbarMsg] = useState<string>('Hola');
  const [rutinaOriginal, setRutinaOriginal] = useState<string>('');

  useEffect(() => {
    // si recibe un mensaje desde el servidor BLE
    if (receivedMSG) {
      console.log('receivedMSG: ' + receivedMSG);

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
      cleanBLECode();
    }
  }, [BLECode, receivedMSG]);

  const handleFunctions: Funciones = {
    rut: (rutinaOriginal) => {
      setRutinaOriginal(rutinaOriginal);
    },
    // resultado del juego
    res: (dato) => {
      setVisibleSnackbar(true);
      SetsnackbarMsg(dato);
      navigator.navigate('ViewResult', { res: dato, rutina: rutinaOriginal });
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
