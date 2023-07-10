import { View } from 'react-native'
import React from 'react'
import { CheckBox } from 'react-native-elements';

// shows the categories like hair care, beard care and hair + beard care
const Categories = ({selectedCategoryIndex, setSelectedCategoryIndex, selectedCategory}) => {
    return (
        <View className="flex-row">
            <CheckBox
                checked={selectedCategoryIndex === 0}
                onPress={() => setSelectedCategoryIndex(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={selectedCategory[0]}
                containerStyle={{ backgroundColor: "black", borderWidth: 0 }}
                textStyle={{ color: "white" }}
            />
            <CheckBox
                checked={selectedCategoryIndex === 1}
                onPress={() => setSelectedCategoryIndex(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={selectedCategory[1]}
                containerStyle={{ backgroundColor: "black", borderWidth: 0 }}
                textStyle={{ color: "white" }}
            />

            <CheckBox
                checked={selectedCategoryIndex === 2}
                onPress={() => setSelectedCategoryIndex(2)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={selectedCategory[2]}
                containerStyle={{ backgroundColor: "black", borderWidth: 0 }}
                textStyle={{ color: "white" }}
            />
        </View>
    )
}

export default Categories;

