import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../../utils/EstilosGlobales';
import Constants from 'expo-constants';
import { Button, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';
import { RootTabs } from '../../Main';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useLocalStorage from '../../utils/useLocalStorage';

type propsType = NativeStackScreenProps<RootTabs>;

const LoginPage = (props: propsType) => {
  const { navigation } = props;
  const [userName, setUserName] = useState<string>('EliasBianchi');
  const [contraseña, setContraseña] = useState<string>('bianchi');
  const { login, token } = useCustomRemoteStorage();
  const { localToken } = useLocalStorage();

  useEffect(() => {
    if (localToken !== '') {
      navigation.navigate('Home');
    }
  }, [localToken]);

  const handleSubmit = () => {
    if (userName.trim() === '') {
      console.log('username');
      return;
    }
    if (contraseña.trim() === '') {
      console.log('password');
      return;
    }

    login(userName.trim(), contraseña.trim());
  };

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.grayBackground }}>
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
      </View>

      <View style={styles.body}>
        <View style={{ paddingHorizontal: 30 }}>
          <TextInput
            label={'Nombre de usuario'}
            style={{ marginVertical: 10 }}
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            label={'Contraseña'}
            style={{ marginVertical: 10 }}
            value={contraseña}
            onChangeText={setContraseña}
            // secureTextEntry={true}
          />

          <View style={{ marginTop: 30 }}>
            <Button mode="contained" onPress={handleSubmit}>
              Entrar
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3CB371',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  text: {
    color: GlobalStyles.white,
    textAlign: 'center',
    flex: 1,
    padding: 15,
    fontSize: 25,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
});

export default LoginPage;
