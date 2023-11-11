import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';

import GlobalStyles from '../../utils/EstilosGlobales';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';

const LoginFormComponent = () => {
  const { isLoginLoading, errorLogin, login, setErrorLogin } = useCustomRemoteStorage();

  const [userName, setUserName] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleSubmit = () => {
    let errUsernam: boolean = false,
      errPassword: boolean = false;

    if (userName.trim() == '') {
      errUsernam = true;
      setNameError('Nombre no puede estar vació');
    }
    if (contraseña.trim() == '') {
      errPassword = true;
      setPasswordError('Contraseña invalida');
    }

    if (errUsernam || errPassword) {
      console.log('error');
      return;
    }

    setErrorLogin('');
    login(userName, contraseña);
  };

  const hideError = (type: number) => {
    if (type === 0) {
      setNameError('');
    }

    if (type === 1) {
      setPasswordError('');
    }
  };

  return (
    <>
      <TextInput
        label={'Nombre de usuario'}
        style={{ marginVertical: 10 }}
        value={userName}
        onChangeText={setUserName}
        error={nameError !== ''}
        onFocus={() => hideError(0)}
      />
      {/* Mostrar error de username */}
      {nameError !== '' && (
        <View style={styles.errorMessage}>
          <Text style={{ color: GlobalStyles.white }}>{nameError}</Text>
        </View>
      )}

      <TextInput
        label={'Contraseña'}
        style={{ marginVertical: 10 }}
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry={true}
        error={passwordError !== ''}
        onFocus={() => hideError(1)}
      />
      {/* Mostrar error de contraseña */}
      {passwordError !== '' && (
        <View style={styles.errorMessage}>
          <Text style={{ color: GlobalStyles.white }}>{passwordError}</Text>
        </View>
      )}

      {/* Action */}
      <View style={{ marginTop: 30 }}>
        <Button mode="contained" onPress={handleSubmit} disabled={isLoginLoading}>
          Entrar
        </Button>
      </View>

      {errorLogin !== '' && (
        <View style={[styles.errorMessage, { marginTop: 20 }]}>
          <Text style={{ color: GlobalStyles.white, textAlign: 'center' }}>{errorLogin}</Text>
        </View>
      )}

      {isLoginLoading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator animating={true} color={GlobalStyles.blueBackground} size={80} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    backgroundColor: GlobalStyles.redError,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
export default LoginFormComponent;
