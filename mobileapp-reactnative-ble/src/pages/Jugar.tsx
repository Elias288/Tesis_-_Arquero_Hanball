import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DATA } from "./List";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { stackScreens } from './AllScreens';

type dataTypeList = {
    id: string;
    title: string;
  };

type propsType= NativeStackScreenProps<stackScreens,'Jugar'>;

const Jugar = (props:propsType) => {

    const {navigation}=props;
    const gotoJugarSecuencia=(nomJug:string)=>{
        navigation.navigate('JugarSec',{jug:nomJug});
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Seleccionar jugador</Text>
            <FlatList
                data={DATA}
                renderItem={({item}) => (
                    <View style={styles.item}> 
                        <TouchableOpacity onPress={() => gotoJugarSecuencia(item.title)}>
                            <Text style={styles.title}>{item.title}</Text>
                        </TouchableOpacity>
                    </View>)}
            keyExtractor={(item: dataTypeList) => item.id}
            />
        </SafeAreaView>
    )
}

export default Jugar

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