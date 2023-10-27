import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

import { InicioTabPages } from '../navigation/InicioTab';
import HeaderComponent from '../components/Header.component';
import ListarJugadoresComponent, { sortType } from '../components/ListarJugadores.component';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { RootTabs } from '../Main';
import CrearRutinaAleatoriaComponent from '../components/CrearRutinaAleatoria.component';
import ModalAgregarJugador from '../components/ModalAgregarJugador.component';
import { useCustomBLE } from '../contexts/BLEProvider';
import CustomModal from '../components/CustomModal.component';
import CrearRutina from '../components/CrearRutina.component';
import { useCustomLocalStorage } from '../contexts/LocalStorageProvider';
import { RutinaType } from '../data/RutinasType';

type propsType = CompositeScreenProps<
  NativeStackScreenProps<InicioTabPages, 'InicioPage'>,
  NativeStackScreenProps<RootTabs>
>;

const InicioPage: FC<propsType> = ({ navigation, route }) => {
  return (
    <>
      <HeaderComponent title={'DEAH App'} />
      <ScrollView style={pageStyles.scrollViewStyle} nestedScrollEnabled>
        <View style={{ marginBottom: 13 }}>
          <CrearRutinas />

          <Jugadores />

          <HistorialRutinas />
        </View>
      </ScrollView>
    </>
  );
};

const pageStyles = StyleSheet.create({
  scrollViewStyle: { padding: 13 },
});

/******************************************** Iniciar Rutina ********************************************/
const CrearRutinas: FC = () => {
  const [visibleDialogCreateRandom, setVisibleDialogCreateRandom] = useState<boolean>(false);
  const [visibleDialogCreate, setVisibleDialogCreate] = useState<boolean>(false);
  const [visibleDialogWarning, setVisibleDialogWarning] = useState<boolean>(false);
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();

  const cargarRutina = () => {
    if (!espConnectedStatus || !BLEPowerStatus) {
      setVisibleDialogWarning(true);
    } else {
      navigator.navigate('Rutinas', { screen: 'RutinasPage' });
    }
  };
  const crearRutinaAleatoria = () => {
    if (!espConnectedStatus || !BLEPowerStatus) {
      setVisibleDialogWarning(true);
    } else {
      setVisibleDialogCreateRandom(true);
    }
  };
  const closeAllModals = () => {
    setVisibleDialogCreate(false);
    setVisibleDialogCreateRandom(false);
    setVisibleDialogWarning(false);
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Crear Rutina</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>

        <View style={cardStyles.cardOptions}>
          <OptionButtons text="Rutina Aleatoria" icon="dice-6" action={crearRutinaAleatoria} />
          <OptionButtons
            text="Crear Rutina"
            icon="plus"
            action={() => setVisibleDialogCreate(true)}
          />

          <OptionButtons text="Cargar Rutina" icon="upload" action={cargarRutina} />
        </View>
      </View>

      {/* Modal de crear rutina */}
      <CrearRutina
        isVisible={visibleDialogCreate}
        hideModal={() => setVisibleDialogCreate(false)}
      />

      {/* Modal de crear rutina aleatoria */}
      <CrearRutinaAleatoriaComponent
        setVisibleDialogCreateRandom={setVisibleDialogCreateRandom}
        visible={visibleDialogCreateRandom}
      />

      <CustomModal isAccept={true} hideModal={closeAllModals} isVisible={visibleDialogWarning}>
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
    </CustomCard>
  );
};

/******************************************* Agregar Jugador *******************************************/
const Jugadores: FC = () => {
  const [isVisibleAgregarJugador, setVisibleAgregarJugador] = useState(false);
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();

  const gotAgregarJugador = () => {
    navigator.navigate('Jugadores', { screen: 'ListaJugadores' });
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Jugadores</Text>

      <OptionButtons
        text="Agregar Jugador"
        icon="account-plus"
        action={() => setVisibleAgregarJugador(true)}
      />

      <ModalAgregarJugador
        hideModal={() => setVisibleAgregarJugador(false)}
        isVisible={isVisibleAgregarJugador}
      />

      <View style={{ paddingTop: 15 }}>
        <Text>Últimos jugadores agregados</Text>
        <ListarJugadoresComponent cantRenderItems={2} isSimpleList={true} sort={sortType.newest} />
      </View>

      <Button textColor="#000" onPress={gotAgregarJugador}>
        Ver más
      </Button>
    </CustomCard>
  );
};

/***************************************** Historial de Rutinas *****************************************/
//TODO: testear
const HistorialRutinas: FC = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();
  const { rutinasRealizadas } = useCustomLocalStorage();
  const [rutinasRealizadasEnLaSemana, setRutinasRealizadasEnLaSemana] = useState<Array<RutinaType>>(
    []
  );
  const [duracionEntrenamientosSemana, setDuracionEntrenamientosSemana] = useState<number>(0);

  useEffect(() => {
    obtenerRutinasRealizadasEnSemana();
    obtenerDuracionRutinasRealizadasEnSemana();
  }, [rutinasRealizadas]);

  const obtenerRutinasRealizadasEnSemana = () => {
    const fechaActual = new Date();
    const diaDeLaSemana = fechaActual.getDay();
    // Calcular la fecha del primer día de la semana actual (domingo)
    const primerDiaDeLaSemana = new Date(fechaActual);
    primerDiaDeLaSemana.setDate(fechaActual.getDate() - diaDeLaSemana);

    // Calcular la fecha del último día de la semana actual (sábado)
    const ultimoDiaDeLaSemana = new Date(fechaActual);
    ultimoDiaDeLaSemana.setDate(fechaActual.getDate() + (6 - diaDeLaSemana));

    setRutinasRealizadasEnLaSemana(
      rutinasRealizadas.filter((item: RutinaType) => {
        return item.date >= primerDiaDeLaSemana && item.date <= ultimoDiaDeLaSemana;
      })
    );
  };

  const obtenerDuracionRutinasRealizadasEnSemana = () => {
    if (rutinasRealizadasEnLaSemana) {
      setDuracionEntrenamientosSemana(
        rutinasRealizadasEnLaSemana.reduce((acumulador, rutina) => {
          const tiempoRutina = rutina.secuencia.reduce(
            (acumuladorSecuencias, secuencia) => acumuladorSecuencias + secuencia.time,
            0
          );
          return acumulador + tiempoRutina;
        }, 0) / 60
      );
    }
  };

  const ContadorCard = () => {
    return (
      <View style={historialStyles.container}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
            {rutinasRealizadasEnLaSemana.length}
          </Text>
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
            <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
              {duracionEntrenamientosSemana}
            </Text>
            <Text>m</Text>
          </View>
          <Text style={{ textAlign: 'center' }}>Duración total de entrenamientos esta semana</Text>
        </View>
      </View>
    );
  };
  const gotRutinas = () => {
    navigator.navigate('Rutinas', { screen: 'RutinasPage' });
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Historial de Rutinas</Text>
      <ContadorCard />
      {/* TODO: agregar lista de rutinas realizadas */}
      <Button textColor="#000" onPress={gotRutinas}>
        Ver más
      </Button>
    </CustomCard>
  );
};

const historialStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
  },
});

/********************************************* OptionButtons *********************************************/
type optionButtonType = {
  text: string;
  icon: string;
  action?: () => void;
};
const OptionButtons = (props: optionButtonType) => {
  const { text, icon, action } = props;

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

export default InicioPage;
