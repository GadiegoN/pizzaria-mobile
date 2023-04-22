import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from '@react-navigation/native';
import { api } from "../../services/api";


export default function Dashboard() {
    const navigation = useNavigation();
    const { signOut } = useContext(AuthContext)

    const [number, setNumber] = useState('')

    async function openOrder() {
        
        if(number === '') {
            return;
        }

        const response = await api.post('/order', {
            table: Number(number),
        })

        navigation.navigate('Order', { number: number, order_id: response.data.id  })

        setNumber('')
        
    }

    return (
        <SafeAreaView style={styles.container}>
            <MaterialIcons name={"exit-to-app"} size={32} color={'#FFF'} style={styles.logout} onPress={signOut} />

            <Text style={styles.title}>Novo pedido</Text>

            <TextInput
                placeholder="Numero da mesa"
                placeholderTextColor={'#F0F0F0'}
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={openOrder}
            >
                <Text
                    style={styles.buttonText}
                >
                    Abrir mesa
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15
    },
    logout: {
        position: 'absolute',
        top: 50,
        right: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        paddingHorizontal: 15,
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3FFFA3',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginVertical: 16
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1d1d2e',
    }
})