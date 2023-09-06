import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// import DeviceModal from "./components/DeviceConnectionModal";
// import useBLE from './components/useBle';

const Main = () => {
    /* const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const {
        requestPermissions,
        scanForPeripherals,
        allDevices
    } = useBLE();

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();
        }
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const openModal = async () => {
        scanForDevices();
        setIsModalVisible(true);
    }; */

    return (
        <SafeAreaView style={styles.container}>
            <Text>Mobile App - React Native - BLE</Text>
            
            {/* <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Connect</Text>
            </TouchableOpacity>

            <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={() => { }}
                devices={allDevices}
            /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaButton: {
        backgroundColor: "#FF6060",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});

export default Main;
