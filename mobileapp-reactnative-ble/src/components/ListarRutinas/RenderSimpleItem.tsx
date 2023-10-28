import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GlobalStyles from '../../utils/EstilosGlobales';
import { RutinaType } from '../../data/RutinasType';
import { RutinaTabPages } from '../../navigation/RutinasTab';
import formateDate from '../../utils/formateDate';
import { JugadorType } from '../../data/JugadoresType';
import { useCustomLocalStorage } from '../../contexts/LocalStorageProvider';

type renderSimpleItemProps = {
  rutina: RutinaType;
  isRutinaRealizada: boolean;
};
export const RenderSimpleItem = ({ rutina, isRutinaRealizada }: renderSimpleItemProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<RutinaTabPages>>();
  const { jugadores } = useCustomLocalStorage();

  const [jugador, setJugador] = useState<JugadorType>();

  useEffect(() => {
    console.log(JSON.stringify(rutina, null, 4));

    if (isRutinaRealizada) {
      const jugadorById = jugadores.find((jugador) => jugador.id == rutina.jugadorID);
      setJugador(jugadorById);
    }
  }, []);

  const goToViewRutina = () => {
    navigator.navigate('ViewRutina', { rutinaId: rutina.id, isRutinaResultado: isRutinaRealizada });
  };

  return (
    <TouchableOpacity style={styles.simpleItemContainer} onPress={goToViewRutina}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="circle" size={50} color={GlobalStyles.greenBackColor} />
        <Text style={{ position: 'absolute', color: GlobalStyles.white }}>{rutina.id}</Text>
      </View>

      <View style={styles.simpleInfoContainer}>
        <Text style={styles.itemTitle}>{rutina.title}</Text>
        {isRutinaRealizada && <Text>Jugador: {jugador?.name}</Text>}
      </View>

      <Text style={styles.simpleItemSubText}>{formateDate(new Date(rutina.createDate), true)}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  simpleItemContainer: {
    backgroundColor: GlobalStyles.white,
    padding: 5,
    borderRadius: 5,
    marginBottom: 13,
    flexDirection: 'row',
  },
  simpleInfoContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  simpleItemSubText: {
    fontSize: 13,
    flex: 1,
  },
  itemTitle: {
    flex: 4,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
