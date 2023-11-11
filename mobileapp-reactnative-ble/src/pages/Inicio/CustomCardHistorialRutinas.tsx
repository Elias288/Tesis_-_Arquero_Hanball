import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import CustomCard, { cardStyles } from './CustomCard';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import GlobalStyles from '../../utils/EstilosGlobales';
import { HomeTabs } from '../../navigation/HomeTab';
import { ResultadoType } from '../../data/ResultadoType';

const CustomCardHistorialRutinas: FC = () => {
  const navigator = useNavigation<NativeStackNavigationProp<HomeTabs>>();
  const { rutinasRealizadas } = useCustomLocalStorage();
  const [rutinasRealizadasEnLaSemana, setRutinasRealizadasEnLaSemana] = useState<
    Array<ResultadoType>
  >([]);
  const [minutosEnEntrenamientosSemana, setMinutosEnEntrenamientosSemana] =
    useState<string>('00:00');

  useEffect(() => {
    const rutinasEnSemana = obtenerRutinasRealizadasEnSemana();
    obtenerDuracionRutinasRealizadasEnSemana(rutinasEnSemana);
  }, [rutinasRealizadas]);

  const obtenerRutinasRealizadasEnSemana = (): Array<ResultadoType> => {
    // Calcula el periodo de la semana y obtiene la lista de rutinas realizadas en ese periodo
    const fechaActual = new Date();

    // Calcular la fecha de los utlimos 7 dias
    const sieteDíasAtras = new Date(fechaActual);
    sieteDíasAtras.setDate(fechaActual.getDate() - 7);

    // filtra las rutinas realizadas en el periodo calculado
    const rutinasEnSemana = rutinasRealizadas.filter((rutinaRealizada) => {
      if (rutinaRealizada?.createDate) {
        return (
          new Date(rutinaRealizada.createDate) >= sieteDíasAtras &&
          new Date(rutinaRealizada.createDate) <= fechaActual
        );
      }
      return;
    });

    setRutinasRealizadasEnLaSemana(rutinasEnSemana);
    return rutinasEnSemana;
  };

  const obtenerDuracionRutinasRealizadasEnSemana = (rutinasEnSemana: Array<ResultadoType>) => {
    if (rutinasEnSemana.length > 0) {
      // obtiene la suma de los tiempos
      const segundosEnRutinas = rutinasEnSemana.reduce((acumulador, rutina) => {
        const segundosEnRutina = rutina.secuencias.reduce(
          (acumuladorSecuencias, secuencia) => acumuladorSecuencias + secuencia.tiempo,
          0
        );

        return acumulador + segundosEnRutina;
      }, 0);

      // formatea la duración en segundos a minutos (00:00)
      const minutosEnSemana =
        Math.floor(segundosEnRutinas / 60)
          .toString()
          .padStart(2, '0') +
        ':' +
        (segundosEnRutinas % 60).toString().padStart(2, '0');

      setMinutosEnEntrenamientosSemana(minutosEnSemana);
    }
  };

  const gotRutinasCargadas = () => {
    navigator.navigate('Rutinas', { screen: 'RutinasRealizadas' });
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Historial de Rutinas</Text>

      <View style={historialStyles.countCard}>
        <View style={{ flex: 1 }}>
          <Text style={historialStyles.cardText}>{rutinasRealizadasEnLaSemana.length}</Text>
          <Text style={{ textAlign: 'center' }}>Total de entrenamientos esta semana</Text>
        </View>

        <View style={{ borderColor: '#b6b6b6', borderWidth: 1 }}></View>

        <View style={{ flex: 1 }}>
          <View style={historialStyles.timeContainer}>
            <Text style={historialStyles.cardText}>{minutosEnEntrenamientosSemana}</Text>
            <Text>m</Text>
          </View>

          <Text style={{ textAlign: 'center' }}>Duración total de entrenamientos esta semana</Text>
        </View>
      </View>

      <Button textColor="#000" onPress={gotRutinasCargadas}>
        Ver Rutinas Realizadas
      </Button>
    </CustomCard>
  );
};

const historialStyles = StyleSheet.create({
  countCard: {
    backgroundColor: GlobalStyles.grayBackground,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  cardText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CustomCardHistorialRutinas;
