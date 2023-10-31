import { FlatList, StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';

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
        data={rutina?.secuencias}
        renderItem={({ item }) => <RenderItemSecuencia secuenciaRes={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ViewSecuenciaResultadoComponent;
