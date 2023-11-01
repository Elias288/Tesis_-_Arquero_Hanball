import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import { RutinaType } from '../../data/RutinasType';
import { useCustomBLE } from '../../contexts/BLEProvider';
import { HomeTabs } from '../../navigation/HomeTab';

interface RenderProps {
  rutina: RutinaType;
  deleteRutina: (id: string) => void;
}
export const RenderItem = (props: RenderProps) => {
  const navigator = useNavigation<NativeStackNavigationProp<HomeTabs>>();
  const { espConnectedStatus, BLEPowerStatus } = useCustomBLE();
  const { rutina, deleteRutina } = props;

  const gotoJugar = () => {
    const newRutina: RutinaType = { ...rutina, playedDate: new Date() };

    navigator?.navigate('Inicio', {
      screen: 'Jugar',
      params: { rutina: JSON.stringify(newRutina) },
    });
  };

  const goToViewRutina = () => {
    navigator.navigate('Rutinas', {
      screen: 'ViewRutina',
      params: { rutinaId: rutina.id },
    });
  };

  return (
    <View style={styles.completeItemContainer}>
      <Text style={styles.itemTitle}>{rutina.title}</Text>

      {/******************************************* Options *******************************************/}
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon={'play'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={gotoJugar}
          disabled={!espConnectedStatus || !BLEPowerStatus}
        />

        <IconButton
          icon={'eye'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={goToViewRutina}
        />

        <IconButton
          icon={'delete'}
          containerColor={GlobalStyles.greenBackColor}
          iconColor={GlobalStyles.white}
          size={30}
          onPress={() => deleteRutina(rutina.id)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completeItemContainer: {
    backgroundColor: GlobalStyles.white,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  simpleItemContainer: {
    backgroundColor: GlobalStyles.white,
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 13,
  },
  simpleItemSubText: {
    fontSize: 13,
  },
  itemTitle: {
    flex: 4,
    fontSize: 18,
    marginHorizontal: 20,
  },
  itemIcon: {
    marginHorizontal: 5,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListMessage: {
    color: GlobalStyles.grayText,
    fontSize: 30,
    fontWeight: '500',
  },
});
