import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { Avatar } from 'react-native-elements';
import { ArrowLeftIcon, PowerIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';
import { PhoneNumberContext } from '../PhoneNumberContext';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const Profile = ({ route }) => {
    const navigation = useNavigation();

    // phone number data from context API
    const { phoneNumber, setPhoneNumber } = useContext(PhoneNumberContext);

    // route params from homeScreen to display logged in name of user
    const {
        params: {
            name,
        },
    } = useRoute();

    // check whether the user is logged in or not for async storage
    const { isLoggedIn, setIsLoggedIn } = route.params;

    // logout functionality
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('phoneNumber');
            console.log('User successfully logged out');
            setIsLoggedIn(false);
            setPhoneNumber('');
            navigation.navigate('PhoneLogin')
            // Perform any additional actions or navigation after logout
        } catch (error) {
            console.log('Error deleting login status:', error);
        }
    };

    // sets and gets the phone number which is stored in async storage
    const [asyncPhone, setAsyncPhone] = useState('');
    if (isLoggedIn) {
        useEffect(() => {
            fetchAsyncPhoneName();
        }, [])
    }

    const fetchAsyncPhoneName = async () => {
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        setAsyncPhone(phoneNumber);
    }

    return (
        <View className="bg-slate-950 flex-1">
            <View style={{ marginTop: responsiveHeight(6), marginHorizontal: responsiveWidth(5) }}>
                {/* arrow key for back screen */}
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 shadow">
                    <View className=" bg-slate-700 rounded-full p-2 self-center" >
                        <ArrowLeftIcon color="#ffffff" size={responsiveFontSize(2.4)} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} className="mt-6">
                    <View className="bg-slate-900
                     flex-row items-center p-5 justify-between rounded-2xl" style={{ elevation: 20 }}>
                        <View>
                            {/* renders the user name and phone number */}
                            <Text className="text-white font-semibold mb-2 mt-2 text-xl tracking-wide">{name}</Text>
                            <Text className="text-white text-sm mb-6 tracking-wider">{isLoggedIn ? asyncPhone : `+91${phoneNumber}`}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-white text-sm mr-2">view activity</Text>
                                <ChevronRightIcon color="#ffffff" size={responsiveFontSize(1.7)} />
                            </View>
                        </View>
                        <View>
                            {/* displays the first letter of username */}
                            <Avatar
                                size={90}
                                rounded
                                title={name[0]}
                                containerStyle={{ backgroundColor: 'white', }}
                                titleStyle={{ color: 'black' }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                <View className="bg-slate-900 p-3 rounded-2xl" style={{ marginTop: responsiveHeight(5) }}>
                    <View className="mb-7">
                        <Text className="text-white font-bold tracking-wider" style={{ fontSize: 16 }}>More</Text>
                    </View>

                    {/* logout button */}
                    <TouchableOpacity onPress={handleLogout}>
                        <View className="flex-row  items-center">
                            <View className="bg-slate-800 rounded-2xl" style={{ padding: responsiveWidth(1.5) }}>
                                <PowerIcon color="#ffffff" size={responsiveFontSize(3)} />
                            </View>
                            <Text className="text-white ml-4 text-base">Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View >
    )
}

export default Profile