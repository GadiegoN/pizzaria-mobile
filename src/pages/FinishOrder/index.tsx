import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";

import { Feather } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";

type RouteDetailParams = {
    FinishOrder: {
        number: number | string
        order_id: string
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder() {
    const route = useRoute<FinishOrderRouteProp>()
    const navigation = useNavigation()

    async function handleFinish() {
        try {
            
            await api.put('/order/send', {
                order_id: route.params?.order_id,
            })

            navigation.navigate('Dashboard')
        } catch (err) {
            console.log('Erro ao finalizar pedido')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather name="arrow-left" color={'#fFF'} size={28} onPress={() => navigation.goBack()} />
                <Text style={styles.headerText}>Finalizando</Text>
            </View>

            <Text style={styles.text}>Deseja finalizar este pedido?</Text>
            <Text style={styles.info}>Mesa: {route.params?.number}</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color='#1d1d2e' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        padding: '5%',
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: 'absolute',
        top: 0,
        width: 300,
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        margin: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    text: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    info: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#fff',
    },
    button: {
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e',
    }
})