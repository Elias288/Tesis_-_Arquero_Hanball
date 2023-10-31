import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Main = () => {
    return (
        <View style={styles.container}>
            <Text>Hola Mundo!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default Main;