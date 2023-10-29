import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyles from '../../utils/EstilosGlobales';

interface selectedItem {
  key: string;
  value: number;
  disabled: boolean;
}

interface crearSecuanciaProps {
  showModal: (text: string) => void;
  pushSecuencia: (led: string, time: number) => void;
}

export const CrearSecuecia = (props: crearSecuanciaProps) => {
  const { showModal, pushSecuencia } = props;
  const [ledsIdList, setLedsIdList] = useState<Array<selectedItem>>([]);
  const [timeList, setTimeList] = useState<Array<selectedItem>>([]);

  const [ledIdSelected, setLedIdSelected] = useState<string>('1');
  const [timeSelected, setTimeSelected] = useState<string>('1');

  useEffect(() => {
    chargeLedList();
    chargeSecondsList();
  }, []);

  const chargeLedList = () => {
    const ledsIdList = [];
    for (let i = 1; i <= 4; i++) {
      ledsIdList.push({ key: `${i}`, value: i, disabled: false });
    }
    setLedsIdList(ledsIdList);
  };

  const chargeSecondsList = () => {
    const secondsList = [];
    for (let i = 1; i <= 10; i++) {
      secondsList.push({ key: `${i}`, value: i, disabled: false });
    }
    setTimeList(secondsList);
  };

  const añadirSecuencia = () => {
    if (ledIdSelected.trim() == '') {
      showModal('Debe seleccionar un led');
      return;
    }

    if (timeSelected.trim() == '') {
      showModal('Debe seleccionar un tiempo');
      return;
    }

    pushSecuencia(ledIdSelected, +timeSelected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>Añadir Secuencia</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ paddingVertical: 10, flex: 1, marginRight: 10 }}>
          <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
            <Icon name="led-on" size={40} color={GlobalStyles.white} />
            <Text style={styles.itemText}>Led</Text>
          </View>
          <SelectList
            setSelected={(ledId: number) => setLedIdSelected(`${ledId}`)}
            data={ledsIdList}
            placeholder="1"
            search={false}
          />
        </View>

        <View style={{ paddingVertical: 10, flex: 1 }}>
          <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
            <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
            <Text style={styles.itemText}>Time</Text>
          </View>
          <SelectList
            setSelected={(second: number) => setTimeSelected(`${second}`)}
            data={timeList}
            placeholder="1"
            search={false}
          />
        </View>
      </View>

      {/* Actions */}
      <View>
        <Button
          buttonColor={GlobalStyles.yellowBackColor}
          textColor={GlobalStyles.yellowTextColor}
          onPress={añadirSecuencia}
          style={[GlobalStyles.buttonStyle, { marginBottom: 10 }]}
        >
          Añadir
        </Button>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: GlobalStyles.black,
    marginTop: 20,
    paddingTop: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemCircle: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemText: {
    color: GlobalStyles.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
