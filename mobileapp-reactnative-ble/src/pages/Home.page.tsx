import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';

import { stackScreens } from '../components/AllScreens';
import HeaderComponent from '../components/Header.component';

type propsType = NativeStackScreenProps<stackScreens, 'HomePage'>;

const HomePage = ({ navigation, route }: propsType) => {
  return (
    <>
      <HeaderComponent title={'BLE App'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#dbdbdb' }}>
        <ScrollView style={{ paddingHorizontal: 13 }}>
          <IniciarRutina navigation={navigation} />
          <AgregarJugador navigation={navigation} />
          <HistorialRutinas />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

/********************************************* Custom Card *********************************************/
const CustomCard = ({ children }: { children: ReactNode }) => {
  return <View style={cardStyles.container}>{children}</View>;
};
const cardStyles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 13 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  options: {
    flex: 1,
    padding: 5,
  },
});

/******************************************** Iniciar Rutina ********************************************/
const IniciarRutina = ({ navigation }: { navigation: any }) => {
  const gotoSecuencias = () => {
    navigation.navigate('Secuencias');
  };
  const gotoCrearSecuencia = () => {
    navigation.navigate('DemoCrearSecuenca');
  };
  const OptionButtons = ({
    text,
    icon,
    action,
  }: {
    text: string;
    icon: string;
    action?: () => void;
  }) => {
    return (
      <Button
        mode="elevated"
        style={{
          marginBottom: 10,
        }}
        icon={icon}
        buttonColor="#e7d84f"
        textColor="#fff"
        onPress={action}
      >
        {text}
      </Button>
    );
  };

  return (
    <CustomCard>
      <Text style={cardStyles.title}>Iniciar Rutina</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={cardStyles.options}>
          <Text>*Última rutina jugada e información relevante</Text>
          <Text>*Mostrar mensaje al clickear si el ESP no está conectaddo</Text>
        </View>

        <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>

        <View style={cardStyles.options}>
          <OptionButtons
            text="Rutina Aleatoria"
            icon="dice-6"
            action={() => alert('not implemented yet')}
          />
          <OptionButtons text="Crear Rutina" icon="plus" action={gotoCrearSecuencia} />
          <OptionButtons text=" Cargar Rutina" icon="upload" action={gotoSecuencias} />
        </View>
      </View>
    </CustomCard>
  );
};

/******************************************* Agregar Jugador *******************************************/
const AgregarJugador = ({ navigation }: { navigation: any }) => {
  const gotAgregarJugador = () => {
    navigation.navigate('Agregar_Jug');
  };
  return (
    <CustomCard>
      <Button textColor="#000" onPress={gotAgregarJugador}>
        Agregar Jugador
      </Button>
    </CustomCard>
  );
};

/***************************************** Historial de Rutinas *****************************************/
const HistorialRutinas = () => {
  const ContadorCard = () => {
    return (
      <View
        style={{ backgroundColor: '#E7E7E7', borderRadius: 10, flexDirection: 'row', padding: 3 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>0</Text>
          <Text style={{ textAlign: 'center' }}>Total de entrenamientos esta semana</Text>
        </View>
        <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'baseline',
            }}
          >
            <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>0</Text>
            <Text>m</Text>
          </View>
          <Text style={{ textAlign: 'center' }}>Duración total de entrenamientos esta semana</Text>
        </View>
      </View>
    );
  };

  return (
    <CustomCard>
      <Text style={cardStyles.title}>Historial de Rutinas</Text>

      <ContadorCard />

      {/* Componente que Lista los jugadores */}
      <Text>Lista de jugadores</Text>
    </CustomCard>
  );
};

export default HomePage;
