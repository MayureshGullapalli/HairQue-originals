import { View, Text, Image, TouchableOpacity, ScrollView, Animated, StyleSheet, FlatList, TextInput } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import AppointmentDate from '../components/AppointmentDate';
import { NavigationHelpersContext, useNavigation, useRoute } from '@react-navigation/native';
import AppointmentTime from '../components/AppointmentTime';
import Booking from './Booking';
import { urlFor } from '../sanity';
import { month, year, monthsInWord, date } from '../dateTime'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directions } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Categories from '../components/Categories';


const StoreScreen = ({ route }) => {
    // navigation with route params for transferring the data to next screen
    const navigation = useNavigation();

    const {
        params: {
            title,
            image,
        },
    } = useRoute();

    const [selectedTime, setSelectedTime] = useState(0);

    const [selectedDate, setSelectedDate] = useState(0);

    const { isLoggedIn } = route.params;

    // comt: button items for map for options
    const Buttons = [
        { id: 0, name: 'Booking' },
        { id: 1, name: 'Portfolio' },
        { id: 2, name: 'Reviews' },
    ];

    // comt: set variable for option button selected
    const [selectedButton, setSelectedButton] = useState(0);

    // comt: function to handle option button press
    const handleButtonPress = (buttonId, button) => {
        // console.log(button);
        setSelectedButton(buttonId);
        startAnimation();
    }

    // comt: funtion to switch to option button text white to black after press
    const getButtonTextStyle = (buttonId) => {
        if (selectedButton === buttonId) {
            return styles.bookingTextSelected;
        } else {
            return styles.bookingText;
        }
    };

    const slideAnim = useRef(new Animated.Value(300)).current;

    const startAnimation = () => {
        slideAnim.setValue(300);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    });

    const data = [
        { id: 1, image: require('../assets/images/m1.png') },
        { id: 2, image: require('../assets/images/m2.png') },
        { id: 3, image: require('../assets/images/m3.png') },
        { id: 4, image: require('../assets/images/m4.png') },
        { id: 5, image: require('../assets/images/g1.png') },
        { id: 6, image: require('../assets/images/g2.png') },
        { id: 7, image: require('../assets/images/g3.png') },
        { id: 8, image: require('../assets/images/g4.png') },
        // Add more images here
    ];

    const ImagesRow = () => {
        const renderImageItem = ({ item }) => (
            <View style={styles.portfolio}>
                <Image source={item.image} style={styles.hairstyleImage} />
            </View >
        );
        return (
            <FlatList
                data={data}
                numColumns={2}
                renderItem={renderImageItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.flatlistContainer}
            />
        )
    }

    const [text, onChangeText] = React.useState('');

    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const category = ["Hair Care", "Beard Care", "Hair + Beard Care"];

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="bg-black">
            <View className="bg-black flex-1">
                {/* store image */}
                <View className="relative">
                    <Image
                        source={{
                            uri: urlFor(image).url(),
                        }}
                        className="w-full"
                        style={{ height: responsiveHeight(25), resizeMode: "cover" }}
                    />

                    {/* back button functionality */}
                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-12 left-5 shadow">
                        <View className=" bg-slate-700 rounded-full p-2 ">
                            <ArrowLeftIcon color="#ffffff" size={responsiveFontSize(2.3)} />
                        </View>
                    </TouchableOpacity>
                    <View className="mx-5">
                        {/* store title which is selected from home screen passed here */}
                        <View className="mt-5">
                            <Text className="text-white font-bold mb-3" style={{ fontSize: 22 }}>
                                {title}
                            </Text>
                            {/* ratings */}
                            <View className="flex-row items-center">
                                <Text className="text-white text-sm font-bold mr-2">⭐</Text>
                                <Text className="text-white text-sm font-bold">4.5</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: responsiveHeight(2) }}>
                            {/*option button mapping*/}
                            <View className="flex-row justify-around">
                                {Buttons.map((btn) => (
                                    <TouchableOpacity
                                        key={btn.id}
                                        style={selectedButton === btn.id ? styles.OptionSelected : styles.Optionsetting}
                                        onPress={() => handleButtonPress(btn.id, btn)}
                                    >
                                        <Text style={getButtonTextStyle(btn.id)}>{btn.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* displaying month and year */}

                        {selectedButton === 0 ?
                            <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                                <View className="flex-row mt-7">
                                    <Text className="text-white mr-2 text-xl font-bold" style={{ fontSize: 20 }}>{monthsInWord[month]}</Text>
                                    <Text className="text-white text-xl font-bold" style={{ fontSize: 20 }}>{year}</Text>
                                </View>
                                <View className="mt-5">
                                    <Text className="text-slate-500 text-xs font-bold">DATE</Text>
                                    {/* 7 days from current date will be displayed here for appointment */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <AppointmentDate active={true} date={date} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
                                    </ScrollView>
                                </View>

                                <View className="mt-5 mb-2">
                                    <Text className="text-slate-500 text-xs font-bold">TIME</Text>
                                    {/* time slot will be displayed here for appointment */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <AppointmentTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                                    </ScrollView>
                                </View>

                                <View className="mt-5 mb-5">
                                    <Text className="text-slate-500 text-xs font-bold">CATEGORIES</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <Categories selectedCategoryIndex={selectedCategoryIndex} selectedCategory={category} setSelectedCategoryIndex={setSelectedCategoryIndex} />
                                    </ScrollView>
                                </View>
                            </Animated.View> :
                            selectedButton === 1 ? <Animated.View style={{ transform: [{ translateX: slideAnim }], }}>
                                <View style={styles.hairStyleContainer}>
                                    <ImagesRow />
                                </View>
                            </Animated.View>
                                : <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                                    <View style={styles.reviewContainer}>
                                        <Text style={{ fontSize: 18, color: 'white', fontWeight: "500", letterSpacing: 0.3 }}>Reviews</Text>
                                        {/* list reviews  */}
                                        <View style={styles.reviews}>
                                            <ReviewComponent review="The Hair Salon App is an absolute game-changer! Booking appointments is a breeze with its user-friendly interface and real-time availability. The stylist profiles and customer reviews helped me make informed choices." />
                                            <ReviewComponent review="skilled stylists who delivered outstanding results. Highly recommended for a convenient and top-notch hair salon experience!" />
                                        </View>
                                    </View>
                                </Animated.View>}
                    </View>
                </View>

                {/* booking confirmation */}
                {selectedButton === 0 ?

                    <Animated.View style={{ marginTop: responsiveHeight(5), marginBottom: responsiveHeight(5), transform: [{ translateX: slideAnim }] }} className="rounded-t-3xl bg-white h-full">
                        <Booking storeName={title} time={selectedTime} date={selectedDate} isLoggedIn={isLoggedIn} selectedCategory={category} selectedCategoryIndex={selectedCategoryIndex} />
                    </Animated.View>
                    : <></>}
            </View >
        </ScrollView >

    )
}

// reviews
const ReviewComponent = ({ review }) => {
    return (
        <Text className="text-slate-300 p-2 text-justify leading-5 bg-slate-900 rounded-lg" style={{ fontSize: 15, marginBottom: responsiveHeight(2) }}>{review}</Text>
    );
}

const styles = StyleSheet.create({
    Optionsetting: {
        width: responsiveWidth(27),
        height: responsiveHeight(4.7),
        justifyContent: 'center',
        alignItems: 'center',
    },
    OptionSelected: {
        backgroundColor: 'white',
        color: "black",
        width: responsiveWidth(27),
        height: responsiveHeight(5),
        borderRadius: responsiveWidth(2.4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookingText: {
        fontSize: 15,
        color: '#B6B6B4',
        fontWeight: "bold",
        letterSpacing: 0.4
    },
    bookingTextSelected: {
        color: 'black',
        fontWeight: "600",
        letterSpacing: 0.4
    },
    portfolio: {
        backgroundColor: 'white',
        width: responsiveWidth(25),
        borderRadius: responsiveWidth(2),
        marginHorizontal: responsiveWidth(7),
        marginVertical: responsiveWidth(3),
        alignItems: 'center'
    },
    hairstyleImage: {
        width: responsiveWidth(15),
        height: responsiveHeight(13),
        resizeMode: "contain",
    },
    flatlistContainer: {
        alignItems: 'center',
        padding: responsiveHeight(4),
    },
    reviewContainer: {
        marginTop: responsiveHeight(2),
    },
    reviews: {
        marginTop: responsiveWidth(5),
        elevation: 10,
    },
})

export default StoreScreen