import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DATA_S } from "./Secuencias";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { stackScreens } from '../Main';

type propsType= NativeStackScreenProps<stackScreens,'JugarSec'>;

type dataTypeList = {
    id: string;
    title: string;
  };

const JugarSec = (props:propsType) => {
    const {navigation,route} = props;
    const {jug} = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Seleccionar secuencia para: {jug}</Text>
            <FlatList
                data={DATA_S}
                renderItem={({item}) => (
                    <View style={styles.item}> 
                        <TouchableOpacity>
                            <Text style={styles.title}>{item.title}</Text>
                        </TouchableOpacity>
                    </View>)}
            keyExtractor={(item: dataTypeList) => item.id}
            />
        </SafeAreaView>
    )
}

export default JugarSec

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        justifyContent:"center",
        alignItems:"center",
      },
    heading:{
        fontSize:30,
        fontWeight:"bold",
        marginBottom: 10,
        padding: 5
    },
    item: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        width:350,
        flexDirection: 'row'
      },
      title: {
        flex:4,
        fontSize: 18
      }
});