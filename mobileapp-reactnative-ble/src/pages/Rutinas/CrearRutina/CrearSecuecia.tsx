import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyles from '../../../utils/EstilosGlobales';
import { secuenciaType } from '../../../data/RutinasType';

interface selectedItem {
  key: string;
  value: number;
  disabled: boolean;
}

interface crearSecuanciaProps {
  callModal: (text: string) => void;
  pushSecuencia?: (led: string, time: number) => void;
  updateSecuencia?: (secuencia: secuenciaType) => void;
  secuencia?: secuenciaType;
}

export const CrearSecuecia = (props: crearSecuanciaProps) => {
  const { callModal: showModal, pushSecuencia, updateSecuencia, secuencia } = props;

  const [selectedSecuencia, setSelectedSecuencia] = useState<secuenciaType | undefined>(secuencia);
  const [ledsIdList, setLedsIdList] = useState<Array<selectedItem>>([]);
  const [timeList, setTimeList] = useState<Array<selectedItem>>([]);

  const [ledIdSelected, setLedIdSelected] = useState<string>('1');
  const [timeSelected, setTimeSelected] = useState<string>('1');

  useEffect(() => {
    chargeLedList();
    chargeSecondsList();
  }, []);

  useEffect(() => {
    setSelectedSecuencia(secuencia);
  }, [secuencia]);

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

    if (pushSecuencia !== undefined) pushSecuencia(ledIdSelected, +timeSelected);
  };

  const actualizarSecuencia = () => {
    if (updateSecuencia !== undefined && secuencia !== undefined) {
      updateSecuencia({ ...secuencia, ledId: ledIdSelected, tiempo: +timeSelected });
    }
  };

  const cancel = () => {
    if (updateSecuencia !== undefined && secuencia !== undefined) {
      updateSecuencia({ ...secuencia });
    }
  };

  if (updateSecuencia !== undefined) {
    if (selectedSecuencia !== undefined) {
      return (
        <View>
          <Text style={styles.subTitle}>Actualizar Secuencia {+selectedSecuencia.id + 1}</Text>

          <View style={{ flexDirection: 'row' }}>
            {/* led */}
            <View style={{ paddingVertical: 10, flex: 1, marginRight: 10 }}>
              <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="led-on" size={40} color={GlobalStyles.white} />
                  <Text
                    style={{
                      color: GlobalStyles.greenBackColor,
                      position: 'absolute',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    {selectedSecuencia.ledId}
                  </Text>
                </View>

                <Text style={styles.itemText}>Led</Text>
              </View>

              <SelectList
                setSelected={(ledId: number) => setLedIdSelected(`${ledId}`)}
                data={ledsIdList}
                placeholder="1"
                search={false}
              />
            </View>

            {/* time */}
            <View style={{ paddingVertical: 10, flex: 1 }}>
              <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
                  <Text
                    style={{
                      color: GlobalStyles.white,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    {selectedSecuencia.tiempo}s
                  </Text>
                </View>
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
              onPress={actualizarSecuencia}
              style={[GlobalStyles.buttonStyle, { marginBottom: 10 }]}
            >
              Actualizar
            </Button>
            <Button
              buttonColor={GlobalStyles.redError}
              textColor={GlobalStyles.white}
              onPress={cancel}
              style={[GlobalStyles.buttonStyle, { marginBottom: 10 }]}
            >
              Cancelar
            </Button>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  return (
    <View>
      <Text style={styles.subTitle}>Añadir Secuencia</Text>

      <View style={{ flexDirection: 'row' }}>
        {/* Led */}
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

        {/* Time */}
        <View style={{ paddingVertical: 10, flex: 1 }}>
          <View style={[styles.itemCircle, { backgroundColor: GlobalStyles.greenBackColor }]}>
            <Icon name="timer-sand-complete" size={40} color={GlobalStyles.white} />
            <Text style={styles.itemText}>Tiempo</Text>
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
