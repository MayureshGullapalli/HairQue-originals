import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const Authentication = ({ otp, setOtp, verifyOtp }) => {
    //state to disable a button until otp entered 
    const [disable, setDisable] = useState(true)

    // check whether the otp length is 6
    useEffect(() => {
        if (otp.length == 6) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [otp])

    return (
        <>
            {/* title */}
            <Text className="text-white font-bold text-3xl">Verify OTP.</Text>
            
            {/* otp input */}
            <View style={{ marginTop: responsiveHeight(7) }}>
                <TextInput
                    className="border bg-slate-900 rounded-2xl text-white shadow border-slate-700 tracking-wider"
                    onChangeText={txt => {
                        setOtp(txt)
                    }}
                    value={otp}
                    placeholder="Otp"
                    keyboardType='number-pad'
                    maxLength={6}
                    placeholderTextColor="gray"
                    selectionColor={'white'}
                    style={{ fontSize: 14, padding: responsiveWidth(3.6) }}
                />
                {/* otp verify button */}
                <TouchableOpacity onPress={verifyOtp} disabled={disable} className={disable ? "bg-white rounded-2xl opacity-60" : "bg-white rounded-2xl"} style={{ marginTop: responsiveWidth(7), padding: responsiveWidth(3) }}>
                    <Text className="text-black self-center font-semibold">Next</Text>
                </TouchableOpacity>
            </View>
        </>

    )
}

export default Authentication