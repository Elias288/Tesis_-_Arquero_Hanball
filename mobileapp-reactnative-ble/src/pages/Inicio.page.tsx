import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, ReactNode, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

import { InicioTabPages } from '../navigation/InicioTab';
import HeaderComponent from '../components/Header.component';
import ListarJugadoresComponent from '../components/ListarJugadores.component';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootTabs } from '../Main';
import CrearRutinaAleatoriaComponent from '../components/CrearRutinaAleatoria.component';
import ModalAgregarJugador from '../components/ModalAgregarJugador.component';
import { useCustomBLE } from '../contexts/BLEProvider';
import CustomModal from '../components/CustomModal.component';
import CrearRutina from '../components/CrearRutina.component';

type propsType = CompositeScreenProps<
  NativeStackScreenProps<InicioTabPages, 'InicioPage'>,
  NativeStackScreenProps<RootTabs>
>;

const InicioPage: FC<propsType> = ({ navigation, route }) => {
  const [visibleDialogCreateRandom, setVisibleDialogCreateRandom] = useState<boolean>(false);
  const [visibleDialogCreate, setVisibleDialogCreate] = useState<boolean>(false);
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  /******************************************** Iniciar Rutina ********************************************/
  const IniciarRutina: FC = () => {
    const gotoSecuencias = () => {
      navigation.navigate('Rutinas', { screen: 'RutinasPage' });
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

    const closeAllModals = () => {
      setVisibleDialogCreate(false);
      setVisibleDialogCreateRandom(false);
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
            <OptionButtons
              text="Crear Rutina"
              icon="plus"
              action={() => setVisibleDialogCreate(true)}
            />

            <OptionButtons text=" Cargar Rutina" icon="upload" action={gotoSecuencias} />
          </View>
        </View>

        {espConnectedStatus && BLEPowerStatus ? (
          <>
            {/* Modal de crear rutina */}
            <CrearRutina
              isVisible={visibleDialogCreate}
              hideModal={() => setVisibleDialogCreate(false)}
            />
            {/* Modal de crear rutina aleatoria */}
            <CrearRutinaAleatoriaComponent
              setVisibleDialogCreateRandom={setVisibleDialogCreateRandom}
              visible={visibleDialogCreateRandom}
              navigation={navigation}
            />
          </>
        ) : (
          <CustomModal
            isAccept={true}
            hideModal={closeAllModals}
            isVisible={visibleDialogCreateRandom || visibleDialogCreate}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 20,
                }}
              >
                Bluetooth no está conectado
              </Text>
              <Text style={{ marginBottom: 20 }}>
                Enciendaló para poder generar una rutina aleatoria
              </Text>
            </View>
          </CustomModal>
        )}
      </CustomCard>
    );
  };

  /******************************************* Agregar Jugador *******************************************/
  const AgregarJugador: FC = () => {
    const [isVisibleAgregarJugador, setVisibleAgregarJugador] = useState(false);

    return (
      <CustomCard>
        <Button textColor="#000" onPress={() => setVisibleAgregarJugador(true)}>
          Agregar Jugador
        </Button>

        <ModalAgregarJugador
          hideModal={() => setVisibleAgregarJugador(false)}
          isVisible={isVisibleAgregarJugador}
        />
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

        <ListarJugadoresComponent cantRenderItems={2} isSimpleList={true} />
        <Button textColor="#000" onPress={gotAgregarJugador}>
          Ver más
        </Button>
      </CustomCard>
    );
  };

  return (
    <>
      <HeaderComponent title={'DEAH App'} />
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

export default InicioPage;