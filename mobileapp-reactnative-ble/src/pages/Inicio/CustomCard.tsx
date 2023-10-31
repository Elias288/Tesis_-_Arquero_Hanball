import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import GlobalStyles from '../../utils/EstilosGlobales';

const CustomCard = ({ children }: { children: ReactNode }) => {
  return <View style={cardStyles.cardContainer}>{children}</View>;
};

export const cardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: GlobalStyles.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 13,
  },
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

export default CustomCard;
