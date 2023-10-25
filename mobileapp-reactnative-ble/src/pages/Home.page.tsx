import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, ReactNode, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

import { HomeTabPages } from '../navigation/HomeTab';
import HeaderComponent from '../components/Header.component';
import ListarJugadoresComponent from '../components/ListarJugadores.component';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootTabs } from '../Main';
import CrearRutinaAleatoriaComponent from '../components/CrearRutinaAleatoria.component';

type propsType = CompositeScreenProps<
  NativeStackScreenProps<HomeTabPages, 'HomePage'>,
  NativeStackScreenProps<RootTabs>
>;

const HomePage: FC<propsType> = ({ navigation, route }) => {
  const [visibleDialogCreateRandom, setVisibleDialogCreateRandom] = useState<boolean>(false);
  /******************************************** Iniciar Rutina ********************************************/
  const IniciarRutina: FC = () => {
    const gotoSecuencias = () => {
      navigation.navigate('Rutinas', { screen: 'Secuencias' });
    };
    const gotoCrearSecuencia = () => {
      navigation.navigate('CrearSecuenca');
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
            borderColor: '#746c26',
            borderWidth: 1,
          }}
          icon={icon}
          buttonColor="#e7d84f"
          textColor="#746c26"
          onPress={action}
        >
          {text}
        </Button>
      );
    };

    return (
      <CustomCard>
        <Text style={cardStyles.cardTitle}>Iniciar Rutina</Text>

        <View style={{ flexDirection: 'row' }}>
          <View style={cardStyles.cardOptions}>
            <Text>*Última rutina jugada e información relevante</Text>
            <Text>*Mostrar mensaje al clickear si el ESP no está conectaddo</Text>
          </View>

          <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>

          <View style={cardStyles.cardOptions}>
            <OptionButtons
              text="Rutina Aleatoria"
              icon="dice-6"
              action={() => setVisibleDialogCreateRandom(true)}
            />
            <OptionButtons text="Crear Rutina" icon="plus" action={gotoCrearSecuencia} />
            <OptionButtons text=" Cargar Rutina" icon="upload" action={gotoSecuencias} />
          </View>
        </View>

        <CrearRutinaAleatoriaComponent
          setVisibleDialogCreateRandom={setVisibleDialogCreateRandom}
          visible={visibleDialogCreateRandom}
          navigation={navigation}
        />
      </CustomCard>
    );
  };

  /******************************************* Agregar Jugador *******************************************/
  const AgregarJugador: FC = () => {
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
  const HistorialRutinas: FC = () => {
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
            <Text style={{ textAlign: 'center' }}>
              Duración total de entrenamientos esta semana
            </Text>
          </View>
        </View>
      );
    };
    const gotAgregarJugador = () => {
      navigation.navigate('Jugadores', { screen: 'ListaJugadores' });
    };

    return (
      <CustomCard>
        <Text style={cardStyles.cardTitle}>Historial de Rutinas</Text>

        <ContadorCard />

        <ListarJugadoresComponent cantRenderItems={2} simpleList={true} />
        <Button textColor="#000" onPress={gotAgregarJugador}>
          Ver más
        </Button>
      </CustomCard>
    );
  };

  return (
    <>
      <HeaderComponent title={'BLE App'} />
      <ScrollView style={pageStyles.scrollViewStyle} nestedScrollEnabled>
        <IniciarRutina />

        <AgregarJugador />

        <HistorialRutinas />
      </ScrollView>
    </>
  );
};

/********************************************* Custom Card *********************************************/
const CustomCard = ({ children }: { children: ReactNode }) => {
  return <View style={cardStyles.cardContainer}>{children}</View>;
};
const cardStyles = StyleSheet.create({
  cardContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 13 },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardOptions: {
    flex: 1,
    padding: 5,
  },
});

const pageStyles = StyleSheet.create({
  scrollViewStyle: { padding: 13 },
});

export default HomePage;
