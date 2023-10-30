import { FlatList, StyleProp, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';

import { RutinaType } from '../../data/RutinasType';
import { RenderItemSecuencia } from './RenderItemSecuencia';

interface ViewSecuenciasResProps {
  rutina: RutinaType;
  style?: StyleProp<ViewStyle>;
}

const ViewSecuenciaResultadoComponent = ({ rutina, style }: ViewSecuenciasResProps) => {
  return (
    <View style={style}>
      <FlatList
        data={rutina?.secuencia}
        renderItem={({ item }) => <RenderItemSecuencia secuenciaRes={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ViewSecuenciaResultadoComponent;
