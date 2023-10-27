import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';

import InicioTab, { InicioTabPages } from './navigation/InicioTab';
import { useCustomBLE } from './contexts/BLEProvider';
import HandleMSGs from './utils/HandleMSGs';
import ListaJugadoresTab, { ListaJugadoresTabPages } from './navigation/ListaJugadoresTab';
import RutinasTab, { RutinaTabPages } from './navigation/RutinasTab';

/************************************************* Main *************************************************/
export type RootTabs = {
  Inicio: NavigatorScreenParams<InicioTabPages>;
  Jugadores: NavigatorScreenParams<ListaJugadoresTabPages>;
  Rutinas: NavigatorScreenParams<RutinaTabPages>;
};

const Tab = createBottomTabNavigator<RootTabs>();

const Main = () => {
  const { initBle } = useCustomBLE();

  useEffect(() => {
    initBle();
  }, []);

  const pageOptions = (routeName: string, focused: boolean) => {
    let iconName = '';
    switch (routeName) {
      case 'Inicio':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Jugadores':
        iconName = focused ? 'account-group' : 'account-group-outline';
        break;
      case 'Rutinas':
        iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
        break;
    }
    return <Icon name={iconName} size={30} color="#3CB371" />;
  };

  return (
    <NavigationContainer>
      <PaperProvider>
        <HandleMSGs />

        <Tab.Navigator
          initialRouteName="Inicio"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              return pageOptions(route.name, focused);
            },
          })}
        >
          <Tab.Screen
            name="Inicio"
            component={InicioTab}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Jugadores"
            component={ListaJugadoresTab}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Rutinas"
            component={RutinasTab}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

/*********************************************** Styles ************************************************/
const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ffffff',
  },
});

export default Main;
