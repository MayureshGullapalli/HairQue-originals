import { View, Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { urlFor } from '../sanity';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

// renders all the stores stored in sanity on homeScreen
const StoreCards = ({ title, image, time, id }) => {
    // using navigation to go to storescreen
    const navigation = useNavigation();

    return (
        <View className="border border-slate-800  p-2 rounded-3xl bg-slate-900" style={{ width: responsiveWidth(50), height: responsiveWidth(73), marginLeft: responsiveWidth(3) }}>
            {/* image of an store */}
            <Image
                source={{
                    uri: urlFor(image).url(),
                }}
                className="rounded-3xl mb-2 self-center"
                style={{ width: responsiveWidth(45), height: responsiveHeight(20), resizeMode: "contain" }}
            />

            {/* open now and store time is shown here */}
            <View className="flex-row mx-2" style={{ marginTop: responsiveHeight(1) }}>
                <Text className="text-yellow-200 text-xs mr-2 font-medium">OPEN NOW</Text>
                <Text className="text-slate-700 text-xs font-bold">{time}</Text>
            </View>

            {/* store name is shown */}
            <Text className="text-white font-bold" style={{ fontSize: 15, padding: responsiveWidth(2), marginBottom: responsiveWidth(2) }}>{title}</Text>

            {/* line shown above book now */}
            <View className="border border-slate-800 w-40 self-center">
            </View>

            {/* book now button sending title and image of selected store data pass to storeScreen*/}
            <TouchableOpacity onPress={() => navigation.navigate('Store', {
                title,
                image,
            })}>
                <Text className="text-white font-semibold self-center" style={{ fontSize: 16, paddingTop: responsiveWidth(2) }}>Book Now</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StoreCards