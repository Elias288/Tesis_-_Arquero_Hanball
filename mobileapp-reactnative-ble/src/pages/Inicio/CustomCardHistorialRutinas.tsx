import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { RootTabs } from '../../Main';
import CustomCard, { cardStyles } from './CustomCard';
import ContadorRutinas from './ContadorRutinas';

const CustomCardHistorialRutinas: FC = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootTabs>>();

  const gotRutinasCargadas = () => {
    navigator.navigate('Rutinas', { screen: 'RutinasRealizadas' });
  };

  return (
    <CustomCard>
      <Text style={cardStyles.cardTitle}>Historial de Rutinas</Text>

      <ContadorRutinas />

      <Button textColor="#000" onPress={gotRutinasCargadas}>
        Ver Rutinas Realizadas
      </Button>
    </CustomCard>
  );
};

export default CustomCardHistorialRutinas;
