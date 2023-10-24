import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';

interface ModalProps {
  isVisible: boolean;
  hideModal: () => void;
  message: string;
  callBack: () => void;
  // opcionales
  isAcceptCancel?: boolean;
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
}
const CustomModal = (props: ModalProps) => {
  const acceptHandle = () => {
    props.callBack();
    props.hideModal();
  };

  return (
    <Portal>
      <Modal visible={props.isVisible}>
        <View style={[props.containerStyle, styles.container]}>
          {props.title && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={[props.titleStyle, styles.title]}>{props.title}</Text>
            </View>
          )}

          <View style={{ paddingBottom: 20 }}>
            <Text style={[props.messageStyle, styles.message]}>{props.message}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button onPress={acceptHandle}>Aceptar</Button>
            {props.isAcceptCancel ? <Button onPress={props.hideModal}>Cancelar</Button> : null}
          </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
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
