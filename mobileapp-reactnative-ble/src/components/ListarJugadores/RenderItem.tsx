import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import { JugadorType } from '../../data/JugadoresType';
import GlobalStyles from '../../utils/EstilosGlobales';

interface RenderProps {
  jugador: JugadorType;
  gotoViewJugadores: (jugadorId: number) => void;
  deleteJugador: (id: number) => void;
}

export const RenderItem = ({ jugador, deleteJugador, gotoViewJugadores }: RenderProps) => {
  return (
    <View style={renderItemStyles.completeItemContainer}>
      <Text style={{ flex: 1, fontSize: 18 }}>{jugador.name}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'eye'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => gotoViewJugadores(jugador.id)}
          mode="contained"
        />
        <IconButton
          icon={'delete'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => deleteJugador(jugador.id)}
          mode="contained"
        />
      </View>
    </View>
  );
};

const renderItemStyles = StyleSheet.create({
  completeItemContainer: {
    backgroundColor: GlobalStyles.white,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 13,
  },
});