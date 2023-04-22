export declare global {
    namespace ReactNavigation {
        interface RootParamList {
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
    }
}