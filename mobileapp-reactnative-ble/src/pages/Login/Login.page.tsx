import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../../utils/EstilosGlobales';
import Constants from 'expo-constants';
import { Button, PaperProvider, ActivityIndicator, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';
import { RootTabs } from '../../Main';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useLocalStorage from '../../utils/useLocalStorage';
import WifiStatusComponent from '../../components/WifiStatus.component';

type propsType = NativeStackScreenProps<RootTabs>;

const LoginPage = (props: propsType) => {
  const { navigation } = props;
  const [userName, setUserName] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const { login, isLoginLoading } = useCustomRemoteStorage();
  const { localToken, saveToken } = useLocalStorage();

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

    saveToken('Elias el mejor');
  };

  return (
    <PaperProvider>
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
              secureTextEntry={true}
            />

            <View style={{ marginTop: 30 }}>
              <Button mode="contained" onPress={handleSubmit}>
                Entrar
              </Button>
            </View>
            <View style={{ marginTop: 20 }}>
              {isLoginLoading && (
                <ActivityIndicator animating={true} color={GlobalStyles.blueBackgroudn} size={50} />
              )}
            </View>
            <WifiStatusComponent neverHide={true} style={{ bottom: 0 }} />
          </View>
        </View>
      </View>
    </PaperProvider>
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
