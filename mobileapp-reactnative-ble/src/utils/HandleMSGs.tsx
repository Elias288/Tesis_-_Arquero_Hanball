import { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useCustomBLEProvider } from './BLEProvider';
import { BLUETOOTHCONNECTED, BLUETOOTHNOTSTATUS } from './BleCodes';

const HandleMSGs = ({ ...props }) => {
  const { receivedMSG, BLECode, BLEmsg, cleanBLECode } = useCustomBLEProvider();
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMsg, SetsnackbarMsg] = useState<string>('Hola');

  useEffect(() => {
    // si recibe un mensaje desde el servidor BLE
    if (receivedMSG) {
      // convierte el mensaje en funcion:dato
      const partes = receivedMSG.split('\t');
      partes.forEach((parte) => {
        const [nombreFuncion, dato] = parte.split(':');
        const funcion = props.funciones[nombreFuncion];
        if (funcion) {
          funcion(dato);
        }
      });
    }

    // si hay un codigo de error
    if (BLECode !== BLUETOOTHCONNECTED && BLECode !== BLUETOOTHNOTSTATUS) {
      setVisibleSnackbar(true);
      SetsnackbarMsg(`${BLECode}: ${BLEmsg}`);
    }
    cleanBLECode();
  }, [BLECode, receivedMSG]);

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
