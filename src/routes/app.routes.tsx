import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../pages/Dashboard';
import Order from '../pages/Order';
import FinishOrder from '../pages/FinishOrder';

export type StackParamsList = {
    Dashboard: undefined
    Order: {
        number: number | string
        order_id: string
    }
    FinishOrder: {
        number: number | string
        order_id: string
    }
}

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name='Dashboard' component={Dashboard} />
            <Stack.Screen name='Order' component={Order} />
            <Stack.Screen name='FinishOrder' component={FinishOrder} />
        </Stack.Navigator>
    )
}

export default AppRoutes;