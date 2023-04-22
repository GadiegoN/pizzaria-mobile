import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity, 
    TextInput,
    Modal,
    FlatList
} from 'react-native';
import { api } from '../../services/api';
import { ModalPicker } from '../../components/ModalPicker';
import { ListItem } from '../../components/ListItem';

type RouterDetailParams = {
    Order: {
        number: string | number
        order_id: string
    }
}

export type CategoryProps = {
    id: string
    name: string
}

export type ProductProps = {
    id: string
    name: string
}

type ItemProps = {
    id: string
    product_id: string
    name: string
    amount: string | number
    // price: string
}

type OrderRouteProps = RouteProp<RouterDetailParams, 'Order'>;

export default function Order() {
    const navigation = useNavigation();
    
    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    const [product, setProduct] = useState<ProductProps[]>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState<ItemProps[]>([])
    
    const route = useRoute<OrderRouteProps>();

    useEffect(() => {
        async function LoadInfo() {
            const response = await api.get('/category')

            setCategory(response.data)
            setCategorySelected(response.data[0])
        }

        LoadInfo()
    }, [])

    useEffect(() => {

        async function LoadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id
                }
            })

            setProduct(response.data)
            setProductSelected(response.data[0])
        }

        LoadProducts()

    }, [categorySelected])

    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: route.params?.order_id,
                }
            })

            navigation.goBack()
        } catch (err) {
            console.log(err)
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item)
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item)
    }

    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: route.params.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })

        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data])
    }

    async function handleDeleteItem(item_id: string) {
        await api.delete('/order/remove', {
            params: {
                item_id: item_id
            }
        })

        let removeItem = items.filter( item => {
            return (item.id !== item_id)
        })

        setItems(removeItem)
    }

    function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            number: route.params?.number,
            order_id: route.params?.order_id
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {
                    items.length === 0 && (
                        <TouchableOpacity onPress={handleCloseOrder}>
                            <Feather name='trash-2' color={'#FF3F4B'} size={28} />
                        </TouchableOpacity>
                    )
                }
            </View>

            {
                category.length !== 0 && (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setModalCategoryVisible(true)}
                    >
                        <Text style={{ color: 'white' }}>
                            {categorySelected?.name}
                        </Text>
                        <MaterialCommunityIcons name="menu-down" size={30} color="#FFF" />
                    </TouchableOpacity>
                )
            }
            {
                product.length !== 0 && (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setModalProductVisible(true)}
                    >
                        <Text style={{ color: 'white' }}>
                            {productSelected?.name}
                        </Text>
                        <MaterialCommunityIcons name="menu-down" size={30} color="#FFF" />
                    </TouchableOpacity>
                )
            }

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade: </Text>
                <TextInput
                    style={[styles.input, { width: '60%', textAlign: 'center' }]}
                    placeholder='1'
                    placeholderTextColor={'#F0F0F0'}
                    keyboardType='numeric'  
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <MaterialCommunityIcons name="plus" size={30} color="#101025" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? .6 : 1}]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => ( 
                    <ListItem 
                        data={item}
                        deleteItem={handleDeleteItem}
                    />
                )}
            />

            <Modal
                transparent
                visible={modalCategoryVisible}
                onRequestClose={() => setModalCategoryVisible(false)}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent
                visible={modalProductVisible}
                onRequestClose={() => setModalProductVisible(false)}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={product}
                    selectedItem={handleChangeProduct}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%',
    },
    header: {
        flexDirection: 'row',
        marginVertical: 26,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14
    },
    input: {
        backgroundColor: '#101026',
        flexDirection: 'row',
        borderRadius: 4,
        width: '100%',
        height: 60,
        marginBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        color: '#FFF',
        fontSize: 22,
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 16
    },
    buttonAdd: {
        borderRadius: 8,
        backgroundColor: '#3FD1FF',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%'
    },
    button: {
        borderRadius: 8,
        backgroundColor: '#3FFFA3',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%'
    },
    buttonText: {
        color: '#101025',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonBack: {
        
    }
})