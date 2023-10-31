import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { JugadorType } from '../../data/JugadoresType';
import GlobalStyles from '../../utils/EstilosGlobales';
import formateDate from '../../utils/formateDate';

interface renderSimpleItemProps {
  jugador: JugadorType;
  gotoViewJugadores: (jugadorId: string) => void;
}

export const RenderSimpleItem = ({ jugador, gotoViewJugadores }: renderSimpleItemProps) => {
  const goToViewJugador = () => {
    gotoViewJugadores(jugador._id);
  };

  return (
    <TouchableOpacity style={renderSimpleItemStyles.simpleItemContainer} onPress={goToViewJugador}>
      <View style={{ flex: 1 }}>
        <Text style={renderSimpleItemStyles.itemTitle}>{jugador.nombre}</Text>
      </View>

      <Text style={renderSimpleItemStyles.simpleItemSubText}>
        {formateDate(new Date(jugador.fechaCreación), false)}
      </Text>
    </TouchableOpacity>
  );
};

const renderSimpleItemStyles = StyleSheet.create({
  simpleItemContainer: {
    backgroundColor: GlobalStyles.grayBackground,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 13,
  },
  simpleItemSubText: {
    fontSize: 13,
  },
  itemTitle: {
    fontSize: 18,
    marginLeft: 1,
  },
});
