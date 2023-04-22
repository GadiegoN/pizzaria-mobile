import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps {
    options: CategoryProps[];
    handleCloseModal: () => void
    selectedItem: (item: CategoryProps) => void
}

const { width: w, height: h } = Dimensions.get('window')

export function ModalPicker({ options, handleCloseModal, selectedItem }: ModalPickerProps) {

    function onPressItem(item: CategoryProps) {
        selectedItem(item)
        handleCloseModal()
    }

    const option = options.map((item, index) => (
        <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => onPressItem(item)}
        >
            <Text style={styles.itemText}>
                {item.name}
            </Text>
        </TouchableOpacity>
    ))

    return (
        <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.container}
        >
            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: w - 20,
        height: h / 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4,
    },
    optionButton: {
        alignItems: 'flex-start',
        borderBottomWidth: .8,
        borderBottomColor: '#8a8a8a'
    },
    itemText: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})