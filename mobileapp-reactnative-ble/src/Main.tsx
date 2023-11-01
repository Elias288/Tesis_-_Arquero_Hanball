import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import LoginPage from './pages/Login/Login.page';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './navigation/HomeTab';

/************************************************* Main *************************************************/
export type RootTabs = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootTabs>();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
