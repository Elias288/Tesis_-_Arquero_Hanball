import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import { JugadorType } from '../../data/JugadoresType';
import GlobalStyles from '../../utils/EstilosGlobales';

interface RenderProps {
  jugador: JugadorType;
  gotoViewJugadores: (jugadorId: string) => void;
  deleteJugador: (id: string) => void;
}

export const RenderItem = ({ jugador, deleteJugador, gotoViewJugadores }: RenderProps) => {
  return (
    <View style={renderItemStyles.completeItemContainer}>
      <Text style={{ flex: 1, fontSize: 18 }}>{jugador.nombre}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'eye'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => gotoViewJugadores(jugador.nombre)}
          mode="contained"
        />
        <IconButton
          icon={'delete'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => deleteJugador(jugador.nombre)}
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
    marginBottom: 13,
  },
});
