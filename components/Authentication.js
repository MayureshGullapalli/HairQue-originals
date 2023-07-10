import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useState } from 'react';
import { useEffect, useContext } from 'react';
import { PhoneNumberContext } from '../PhoneNumberContext';

const Authentication = ({ phoneNumber, setPhoneNumber, validateOtp }) => {

    // disable button until user types his number
    const [disable, setDisable] = useState(true)

    // check the length of the number
    useEffect(() => {
        if (phoneNumber.length == 10) {
            setDisable(false)
        } else {
            setDisable(true)
        }

    }, [phoneNumber])

    return (
        <>
            {/* title */}
            <Text className="text-white font-bold text-3xl">Let's sign you in.</Text>
            
            {/* input to enter phone number */}
            <View style={{ marginTop: responsiveHeight(6) }}>
                <View className="flex-row items-center">
                    <View className="border bg-slate-800 rounded-2xl shadow border-slate-700" style={{ marginRight: responsiveWidth(1) }}>
                        <Text style={{ padding: responsiveWidth(4.4) }} className="text-white font-bold tracking-wider">+91</Text>
                    </View>
                    <View className="flex-1">
                        <TextInput
                            className="border bg-slate-900 rounded-2xl text-white shadow border-slate-700 tracking-wider"
                            onChangeText={txt => {
                                setPhoneNumber(txt)
                            }}
                            value={phoneNumber}
                            placeholder="Phone"
                            keyboardType='number-pad'
                            maxLength={10}
                            placeholderTextColor="gray"
                            selectionColor={'white'}
                            style={{ fontSize: 14, padding: responsiveWidth(3.6) }}
                        />
                    </View>
                </View>

                {/* verify and opens up the captcha for otp */}
                <TouchableOpacity onPress={validateOtp} disabled={disable} className={disable ? "bg-white rounded-2xl opacity-60" : "bg-white rounded-2xl"} style={{ marginTop: responsiveHeight(5), padding: responsiveWidth(3) }}>
                    <Text className="text-black self-center font-semibold">Next</Text>
                </TouchableOpacity>
            </View>
        </>

    )
}

export default Authentication