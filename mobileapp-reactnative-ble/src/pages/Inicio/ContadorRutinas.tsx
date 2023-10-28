import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';
import { RutinaType } from '../../data/RutinasType';

const ContadorRutinas = () => {
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
    const diaDeLaSemana = fechaActual.getDay();
    // Calcular la fecha del primer día de la semana actual (domingo)
    const primerDiaDeLaSemana = new Date(fechaActual);
    primerDiaDeLaSemana.setDate(fechaActual.getDate() - diaDeLaSemana);

    // Calcular la fecha del último día de la semana actual (sábado)
    const ultimoDiaDeLaSemana = new Date(fechaActual);
    ultimoDiaDeLaSemana.setDate(fechaActual.getDate() + (6 - diaDeLaSemana));

    // filtra las rutinas realizadas en el periodo calculado
    const rutinasEnSemana = rutinasRealizadas.filter((item: RutinaType) => {
      return (
        new Date(item.date) >= primerDiaDeLaSemana && new Date(item.date) <= ultimoDiaDeLaSemana
      );
    });

    setRutinasRealizadasEnLaSemana(rutinasEnSemana);
    return rutinasEnSemana;
  };

  const obtenerDuracionRutinasRealizadasEnSemana = (rutinasEnSemana: Array<RutinaType>) => {
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
      (segundosEnRutinas % 60);

    setMinutosEnEntrenamientosSemana(minutosEnSemana);
  };

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
            {minutosEnEntrenamientosSemana}
          </Text>
          <Text>m</Text>
        </View>
        <Text style={{ textAlign: 'center' }}>Duración total de entrenamientos esta semana</Text>
      </View>
    </View>
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

export default ContadorRutinas;
