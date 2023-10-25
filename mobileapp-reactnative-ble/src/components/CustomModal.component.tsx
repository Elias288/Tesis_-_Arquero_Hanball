import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';

interface ModalProps {
  isVisible: boolean;
  hideModal: () => void;
  children: ReactNode;
  // opcionales
  onAceptar?: () => void;
  isAccept?: boolean;
  isAcceptCancel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}
const CustomModal = (props: ModalProps) => {
  const { children, containerStyle, isVisible, isAccept, hideModal, onAceptar, isAcceptCancel } =
    props;

  const acceptHandle = () => {
    if (onAceptar) onAceptar();
    hideModal();
  };

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={hideModal}>
        <View style={[containerStyle, styles.container]}>
          {children}

          {/* Actions */}
          {(isAccept || isAcceptCancel) && (
            <View style={styles.actions}>
              <Button onPress={acceptHandle}>Aceptar</Button>
              {isAcceptCancel ? <Button onPress={hideModal}>Cancelar</Button> : null}
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
});
export default CustomModal;
