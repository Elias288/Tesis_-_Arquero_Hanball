import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { RootTabs } from '../../Main';
import CustomCard, { cardStyles } from './CustomCard';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { RutinaType } from '../../data/RutinasType';

const CustomCardHistorialRutinas: FC = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();
  const { rutinasRealizadas } = useCustomLocalStorage();
  const [rutinasRealizadasEnLaSemana, setRutinasRealizadasEnLaSemana] = useState<Array<RutinaType>>(
    []
  );
  const [minutosEnEntrenamientosSemana, setMinutosEnEntrenamientosSemana] =
    useState<string>('00:00');

  useEffect(() => {
    const rutinasEnSemana = obtenerRutinasRealizadasEnSemana();
    obtenerDuracionRutinasRealizadasEnSemana(rutinasEnSemana);
  }, [rutinasRealizadas]);

  const obtenerRutinasRealizadasEnSemana = (): Array<RutinaType> => {
    // Calcula el periodo de la semana y obtiene la lista de rutinas realizadas en ese periodo
    const fechaActual = new Date();

    // Calcular la fecha de los utlimos 7 dias
    const sieteDíasAtras = new Date(fechaActual);
    sieteDíasAtras.setDate(fechaActual.getDate() - 7);

    // filtra las rutinas realizadas en el periodo calculado
    const rutinasEnSemana = rutinasRealizadas.filter((item) => {
      if (item?.createDate) {
        return (
          new Date(item.createDate) >= sieteDíasAtras && new Date(item.createDate) <= fechaActual
        );
      }
      return;
    });

    setRutinasRealizadasEnLaSemana(rutinasEnSemana);
    return rutinasEnSemana;
  };

  const obtenerDuracionRutinasRealizadasEnSemana = (rutinasEnSemana: Array<RutinaType>) => {
    if (rutinasEnSemana.length > 0) {
      // obtiene la suma de los tiempos
      const segundosEnRutinas = rutinasEnSemana.reduce((acumulador, rutina) => {
        const segundosEnRutina = rutina.secuencia.reduce(
          (acumuladorSecuencias, secuencia) => acumuladorSecuencias + secuencia.time,
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
              {minutosEnEntrenamientosSemana}
            </Text>
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
  container: {
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
    marginBottom: 10,
  },
});

export default CustomCardHistorialRutinas;
