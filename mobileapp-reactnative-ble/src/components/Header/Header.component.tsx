import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { IconButton, Text } from 'react-native-paper';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GlobalStyles from '../../utils/EstilosGlobales';
import { inicioTabPages } from '../../navigation/InicioTab';
import { BleStatus } from './BleStatus';
import { RootTabs } from '../../Main';
import { useCustomRemoteStorage } from '../../contexts/RemoteStorageProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type headerProps = {
  showBackButton?: boolean;
  title?: string;
};

type navigationType = CompositeNavigationProp<
  NativeStackNavigationProp<inicioTabPages>,
  NativeStackNavigationProp<RootTabs>
>;

export const HEADERSIZE = 50;

const HeaderComponent = (props: headerProps) => {
  const navigator = useNavigation<navigationType>();
  const { isWifiConnected } = useCustomRemoteStorage();

  return (
    <View style={styles.container}>
      <View /* style={styles.action} */>
        {props.showBackButton ? (
          <View style={styles.action}>
            <IconButton
              icon={'arrow-u-left-top-bold'}
              iconColor={GlobalStyles.white}
              onPress={() => navigator.goBack()}
            />
          </View>
        ) : (
          <BleStatus />
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>{props.title}</Text>
      </View>

      {!isWifiConnected && (
        <Icon name="wifi-strength-off-outline" size={20} color={GlobalStyles.white} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3CB371',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  action: {
    height: HEADERSIZE,
    width: HEADERSIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: HEADERSIZE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    display: 'flex',
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
