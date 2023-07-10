import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { auth, FIRESTORE_DB } from '../firebaseConfig';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { PhoneNumberContext } from '../PhoneNumberContext';
import { AuthContext } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// asks for username
const NameScreen = ({ route }) => {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');

    // const { phoneNumber } = useContext(PhoneNumberContext);

    const { user, phoneNumber } = useContext(AuthContext);

    const [disable, setDisable] = useState(true)

    const [loading, setLoading] = useState(false)

    const { setIsLoggedIn, fetch } = route.params;

    const [userData, setUserData] = useState(null);


    // get name and store
    useEffect(() => {
        const fetchName = async () => {
            try {
                setLoading(true)
                const userDocRef = doc(FIRESTORE_DB, 'users', phoneNumber);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUsername(userData.username);
                    console.log('user data--', userData)
                    setLoading(false)
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching name:', error);
            }
        };

        if (user && phoneNumber) {
            fetchName();
        }
    }, [user, phoneNumber]);

    const saveName = async () => {
        try {
            const userDocRef = doc(FIRESTORE_DB, 'users', phoneNumber);
            await setDoc(userDocRef, { username, phoneNumber });
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.error('Error saving name:', error);
        }
    };

    const userNameAuth = () => {
        saveName()
        navigation.navigate('Home')
        handleLogin()
    }

    const handleLogin = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('phoneNumber', phoneNumber);
            console.log('User successfully logged in from handleLogin', `+91${phoneNumber}`);
            setIsLoggedIn(true);
        } catch (error) {
            console.log('Error saving login status:', error);
        }
    };

    return (
        <View className="bg-slate-950 flex-1">
            <View style={{ marginVertical: responsiveHeight(25), marginHorizontal: responsiveWidth(5) }}>

                {loading ? <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: responsiveHeight(20) }} /> :
                    <>
                        <Text className="text-white font-bold text-3xl" style={{ marginBottom: responsiveHeight(5) }}>Enter Name.</Text>
                        <TextInput
                            className="border bg-slate-900 rounded-2xl text-white shadow border-slate-700 tracking-wider"
                            onChangeText={txt => {
                                setUsername(txt)
                            }}
                            value={username}
                            placeholder="Name"
                            placeholderTextColor="gray"
                            selectionColor={'white'}
                            style={{ fontSize: 15, padding: responsiveWidth(3.6) }}
                        />
                        <TouchableOpacity onPress={userNameAuth} className="bg-white rounded-2xl" style={{ marginTop: responsiveHeight(5), padding: responsiveWidth(3) }}>
                            <Text className="text-black self-center font-semibold">Continue</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        </View>
    )
}

export default NameScreen