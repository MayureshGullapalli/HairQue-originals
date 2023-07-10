import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { CalendarIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB } from '../firebaseConfig';
import { collection, getDocs, addDoc, where, query, docRef } from "firebase/firestore";
import { monthsInWord, times, days, month, dayInWord, day } from '../dateTime'
import Modal from "react-native-modal";
import { useRoute } from '@react-navigation/native';
import { PhoneNumberContext } from '../PhoneNumberContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppointmentContext from '../AppointmentContext';
import * as Notifications from 'expo-notifications'
import { responsiveWidth } from 'react-native-responsive-dimensions';

const Booking = ({ storeName, time, date, route, isLoggedIn, selectedCategory, selectedCategoryIndex }) => {
    const navigation = useNavigation();

    const { phoneNumber } = useContext(PhoneNumberContext);

    // bottom sheet open and close 
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // notification functionality
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(handleNotification);
        return () => {
            subscription.remove();
        };
    }, []);

    const handleNotification = (notification) => {
        // Handle the received notification here
        const { request: { content: { title, body } } } = notification;

        // Handle the notification data as desired
        console.log('Received notification:');
        // console.log('Title:', title);
        // console.log('Body:', body);
        // You can perform additional actions based on the notification data
        // For example, display the notification in the UI
        console.log(`Received notification:\nTitle: ${title}\nBody: ${body}`);
    };

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);



    const scheduleNotification = async () => {
        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Appointment Booked',
                    body: `${storeName} at ${times[time].roundOffTime} on ${days[date].date}`,
                },
                trigger: {
                    seconds: 5, // Set the time delay for the notification in seconds
                },
            });
            console.log('Notification scheduled with ID:', notificationId);
        } catch (error) {
            console.log('Error scheduling notification:', error);
        }
    };

    // store data into firebase and notify
    const confirmBooking = () => {
        insertDataToFirebase()
        scheduleNotification()
        navigation.navigate('Confirmation')
    }

    const insertDataToFirebase = async () => {
        try {
            const appointmentRef = collection(FIRESTORE_DB, 'appointments');
            const q = query(appointmentRef, where('timeSlotId', '==', time));

            const snapshot = await getDocs(q);
            const count = snapshot.size;

            console.log('count of appointments = ', count);

            if (count == 3) {
                // Disable inserting the data if the time slot is already booked three times
                console.log('Time slot already booked three times. Cannot insert data 1.');
                return;
            }

            if (count < 3) {
                // Create a new appointment document if none exists for the time slot
                if ({ isLoggedIn }) {
                    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
                    const docRef = await addDoc(appointmentRef, {
                        storeName: storeName,
                        day: days[date].dayOfWeek,
                        date: days[date].date,
                        month: monthsInWord[month],
                        time: times[time].roundOffTime,
                        phoneNumber: phoneNumber,
                        timeSlotId: time,
                        Category: selectedCategory[selectedCategoryIndex],
                        count: 1,
                    });
                }
                else {
                    const docRef = await addDoc(appointmentRef, {
                        storeName: storeName,
                        day: days[date].dayOfWeek,
                        date: days[date].date,
                        month: monthsInWord[month],
                        time: times[time].roundOffTime,
                        phoneNumber: `+91${phoneNumber}`,
                        timeSlotId: time,
                        Category: selectedCategory[selectedCategoryIndex],
                        count: 1,
                    });
                }
                console.log('Data inserted successfully with document ID:', docRef.id);
            } else {
                // Update the count field in the existing appointment document
                const appointmentDoc = snapshot.docs[0];
                const docRef = appointmentRef.doc(appointmentDoc.id);

                const currentCount = appointmentDoc.data().count || 0;

                if (currentCount > 2) {
                    console.log('Time slot already booked three times. Cannot insert data.');
                    return;
                }

                await docRef.update({ count: currentCount + 1 });

                console.log('Data updated successfully for document ID:', docRef.id);
            }
        } catch (error) {
            console.log('Error inserting/updating data:', error);
        }
    };

    // const insertDataToFirebase = async () => {
    //     try {
    //         const docRef = await addDoc(collection(FIRESTORE_DB, 'appointments'), {
    //             storeName: storeName,
    //             day: days[date].dayOfWeek,
    //             date: days[date].date,
    //             month: monthsInWord[month],
    //             time: times[time].roundOffTime,
    //             phoneNumber: `+91${phoneNumber}`,
    //             timeSlotId: time,
    //         });
    //         console.log('Data inserted successfully with document ID:', docRef.id);
    //     } catch (error) {
    //         console.log('Error inserting data:', error);
    //     }
    // };

    const {
        params: {
            title,
        },
    } = useRoute();


    return (
        <View className="bg-white">
            <View className=" rounded-t-3xl mx-5 flex-row items-center bg-stone-50 h-20">
                <View className="flex-row flex-1 items-center">
                    {/* calender details shows date */}
                    <CalendarIcon size={25} color="#000000" />
                    <Text className="ml-3 font-bold text-lg">{days[date].dayOfWeek},</Text>
                    <Text className="ml-1 font-bold text-lg">{days[date].month}</Text>
                    <Text className="ml-1 font-bold text-lg">{days[date].date}</Text>
                </View>
                {/* shows time selected */}
                <View>
                    <Text className="ml-3 font-bold text-lg">{times[time].roundOffTime}</Text>
                </View>
            </View>

            {/* bottom sheet */}
            <TouchableOpacity onPress={toggleModal}>
                <View className="bg-black h-14 justify-center items-center w-11/12 self-center rounded-2xl mt-12">
                    <Text className="text-white font-bold text-base">Book Now</Text>
                </View>
            </TouchableOpacity>

            {/* opens up the bottom sheet */}
            <View>
                <Modal
                    onBackdropPress={() => setModalVisible(false)}
                    onBackButtonPress={() => setModalVisible(false)}
                    isVisible={isModalVisible}
                    swipeDirection="down"
                    onSwipeComplete={toggleModal}
                    animationIn="bounceInUp"
                    animationOut="bounceOutDown"
                    animationInTiming={900}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={500}
                    style={styles.modal}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.center}>
                            <View style={styles.barIcon} />
                            <Text className="text-white my-5 font-bold text-lg">Booking Details</Text>
                        </View>
                        {/* shows what the user selected like store name, date and time */}
                        <View className="mb-5 p-2">
                            <ConfirmDetails text="Store" desc={title} />
                            <ConfirmDetails text="Date" desc={days[date].date + " " + days[date].dayOfWeek} />
                            <ConfirmDetails text="Time" desc={times[time].roundOffTime} />
                            <ConfirmDetails text="Category" desc={selectedCategory[selectedCategoryIndex]} />
                        </View>

                        <TouchableOpacity onPress={confirmBooking} className="bg-white p-3 rounded-lg mb-3">
                            <Text className="text-black self-center font-bold ">Confirm Booking</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

// shows details what the user chose like store name, date and time
const ConfirmDetails = ({ text, desc }) => {
    return (
        <View className="flex-row justify-between">
            <Text className="mb-5 text-base text-slate-400 font-light tracking-wide">{text}</Text>
            <Text className="text-base text-slate-300 font-semibold ">{desc}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    flexView: {
        flex: 1,
        backgroundColor: "white",
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: "#161616",
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: 350,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
    },
    text: {
        color: "#bbb",
        fontSize: 24,
        marginTop: 100,
    },

})


export default Booking