import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from './Home';
import ListJugadores from './List';
import Jugar from './Jugar';
import Secuencias from './Secuencias';
import JugarSec from './JugarSecuencia';
import Agregar_Jug from './Agregar_Jug';
import Hist_Jugadores from './Hist_Jugadores';
import DemoCrearSecuenca from './CrearSecuencia';

export type stackScreens = {
    Home: undefined;
    Jugar: undefined;
    List: {jug:string};
    Secuencias: undefined;
    JugarSec: {jug:string};
    Agregar_Jug: undefined;
    Hist_Jugadores: {name:string};
    DemoCrearSecuenca: undefined;
};

const Stack=createNativeStackNavigator<stackScreens>();

const AllScreens = () => {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Jugar" component={Jugar}/>
            <Stack.Screen name="List" component={ListJugadores}/>
            <Stack.Screen name="Secuencias" component={Secuencias}/>
            <Stack.Screen name="JugarSec" component={JugarSec}/>
            <Stack.Screen name="Agregar_Jug" component={Agregar_Jug}/>
            <Stack.Screen name="Hist_Jugadores" component={Hist_Jugadores}/>
            <Stack.Screen name="DemoCrearSecuenca" component={DemoCrearSecuenca}/>
        </Stack.Navigator>
    )
}

export default AllScreens

const styles = StyleSheet.create({

})