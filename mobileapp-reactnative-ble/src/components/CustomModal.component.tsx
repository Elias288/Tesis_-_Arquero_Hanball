import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';

import GlobalStyles from '../utils/EstilosGlobales';

interface ModalProps {
  isVisible: boolean;
  hideModal: () => void;
  children: ReactNode;
  // opcionales
  onAceptar?: () => void;
  onCancelar?: () => void;
  isAccept?: boolean;
  isAcceptCancel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomModal = (props: ModalProps) => {
  const {
    children,
    containerStyle,
    isVisible,
    isAccept,
    hideModal,
    onAceptar,
    onCancelar,
    isAcceptCancel,
  } = props;

  const acceptHandle = () => {
    if (onAceptar) onAceptar();
    hideModal();
  };

  const cancelHandle = () => {
    if (onCancelar) {
      onCancelar();
    }

    hideModal();
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal}>
        <View style={[containerStyle, customModalStyles.container]}>
          {children}

          {/* Actions */}
          {(isAccept || isAcceptCancel) && (
            <View style={customModalStyles.actions}>
              <Button onPress={acceptHandle}>Aceptar</Button>
              {isAcceptCancel ? <Button onPress={cancelHandle}>Cancelar</Button> : null}
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export const customModalStyles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.white,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalMessage: {
    marginBottom: 20
  }
});

export default CustomModal;
