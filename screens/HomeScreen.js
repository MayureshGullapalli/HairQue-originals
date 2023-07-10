import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import StoreCards from '../components/StoreCards'
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import sanityClient from '../sanity';
import { day, date, month, monthsInWord, dayInWord } from '../dateTime'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { ClipboardIcon, CameraIcon } from "react-native-heroicons/outline";
import { doc, getDoc } from "firebase/firestore";
import { useRoute } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { FIRESTORE_DB, auth } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from "firebase/firestore";
import { async } from '@firebase/util';


const HomeScreen = ({ navigation, route }) => {

  // textInput for search
  const [text, onChangeText] = React.useState('');

  //fetches the data of stores from sanity
  const [fetchStores, setFetchStores] = useState([]);

  const { user, phoneNumber } = useContext(AuthContext);
  const [name, setName] = useState('');

  const { isLoggedIn } = route.params;

  // fetch stores from sanity
  useEffect(() => {
    const fetchStoresData = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_type == "stores"] {
                ...,  
              }`
        );
        setFetchStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStoresData();
  }, []);

  // Fetch name from Firestore based on user and phoneNumber
  useEffect(() => {
    const fetchName = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', phoneNumber);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setName(userData.username);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    if (user && phoneNumber) {
      fetchName();
    }
  }, [isLoggedIn, user, phoneNumber]);

  // Fetch name from AsyncStorage if isLoggedIn is true
  useEffect(() => {
    const asyncName = async () => {
      if (isLoggedIn) {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        try {
          const userDocRef = doc(FIRESTORE_DB, 'users', storedPhoneNumber);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setName(userData.username);
          }
        } catch (error) {
          console.error('Error fetching name:', error);
        }
      }
    };

    asyncName();
  }, [isLoggedIn]);


  return (
    <View className="flex-1 bg-black">
      {/* header */}
      <View style={{ marginTop: responsiveHeight(6), marginHorizontal: responsiveWidth(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text className="text-white text-2xl font-bold">HairQue</Text>
        <View className="flex-row items-center">
          <CameraIcon
          onPress={() => navigation.navigate('CameraScreen')}
           size={responsiveFontSize(3.5)}
            color="#fff" 
            style={{ marginRight: responsiveWidth(5) }}
            />
          <ClipboardIcon
            title="Go to Details"
            onPress={() => navigation.navigate('CancelBooking')}
            size={responsiveFontSize(3.5)}
            color="#fff"
            style={{ marginRight: responsiveWidth(5) }}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Profile', { name })}>
            <Avatar
              size={responsiveFontSize(5)}
              rounded
              title={name[0]}
              containerStyle={{ backgroundColor: 'white', }}
              titleStyle={{ color: 'black' }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className="mx-8">
          <View style={{ height: responsiveHeight(10), marginTop: responsiveHeight(6) }}>
            <Text className="text-white text-3xl mb-3">Hey, <Text className="text-white text-3xl font-bold">{name}</Text>👋</Text>
            <Text className="text-white">{dayInWord[day]}, {monthsInWord[month]} {date}</Text>
          </View>

          {/* search functionality */}
          <View className="flex-row items-center" style={{ marginTop: responsiveHeight(3), marginBottom: responsiveHeight(5) }}>
            <TextInput
              className="border-1 bg-gray-900 rounded-2xl text-white shadow flex-1 relative"
              onChangeText={onChangeText}
              value={text}
              placeholder="Search"
              placeholderTextColor="gray"
              selectionColor={'white'}
              style={{ padding: responsiveWidth(3.5) }}
            />
            <View className="absolute right-3">
              <TouchableOpacity>
                <MagnifyingGlassIcon color="#ffffff" size={responsiveFontSize(3)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* listing stores from sanity */}
          <Text className="text-slate-500 text-xs font-bold">NEARBY STORE</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5">
          <View className="ml-5">

          </View>
          {/* lists all the stores like style studio etc.. */}
          {fetchStores?.map((category) => (
            <StoreCards
              key={category._id}
              id={category._id}
              title={category.name}
              image={category.image}
              time={category.time}
            />
          ))}
          <View className="ml-6">

          </View>
        </ScrollView>

      </View>
    </View>
  )
}

export default HomeScreen