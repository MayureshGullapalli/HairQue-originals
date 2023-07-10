import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { FIRESTORE_DB } from '../firebaseConfig'
import { collection, getDocs, deleteDoc, doc, onSnapshot, where, query, orderBy } from "firebase/firestore";
import LottieView from 'lottie-react-native';
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';
import { PhoneNumberContext } from '../PhoneNumberContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// cancel booking component
const CancelBooking = ({ route }) => {
    const navigation = useNavigation();

    // fetch phoneNumber from context API
    const { phoneNumber } = useContext(PhoneNumberContext);

    // store the appointments from firebase with associated phone numbers
    const [dataArray, setDataArray] = useState([]);

    // const [loading, setLoading] = useState(true); // Add loading state

    // const { isLoggedIn } = route.params;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'appointments'));

    //             const newDataArray = querySnapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 storeName: doc.data().storeName,
    //                 day: doc.data().day,
    //                 date: doc.data().date,
    //                 month: doc.data().month,
    //                 time: doc.data().time
    //             }))
    //             setDataArray(newDataArray);
    //         } catch (error) {
    //             console.log('Error fetching data:', error);

    //         }
    //     };

    //     fetchData();
    // }, [dataArray]);


    const [number, setNumber] = useState(`+91${phoneNumber}`)
    console.log('number --', number)

    // fetch the appointments from firebase
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const q = query(
                    collection(FIRESTORE_DB, 'appointments'),
                    where('phoneNumber', '==', number),
                    orderBy('time', 'desc'),
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const appointmentList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setDataArray(appointmentList);
                });

                return unsubscribe;
            } catch (error) {
                console.log('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [number]);

    // fetch the appoitments when the async storage is used
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const phoneNumber = await AsyncStorage.getItem('phoneNumber');
                // Assuming you have a collection named 'users' in Firestore and a field named 'phoneNumber'
                const q = query(collection(FIRESTORE_DB, 'appointments'), where('phoneNumber', '==', phoneNumber));
                const userSnapshot = await getDocs(q);
                const usersData = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                if (usersData.length > 0) {
                    setDataArray(usersData)
                    // console.log(usersData);
                }
                // console.log(phoneNumber);

            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [])


    console.log('data on phone --', dataArray)

    const fetchDocumentIds = async () => {
        try {
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'appointments'));
            const documentIds = querySnapshot.docs.map(doc => doc.id);
            setDocuments(documentIds)
        } catch (error) {
            console.error('Error fetching document IDs:', error);
        }
    };

    // handle deletion of appoinments
    const handleDelete = async (documentId) => {
        try {
            console.log('document id of delete -', documentId)
            await deleteDoc(doc(FIRESTORE_DB, 'appointments', documentId));
            console.log('Document successfully deleted!');

            // Assuming dataArray is a state variable initialized as an array
            setDataArray((prevDataArray) => {
                if (Array.isArray(prevDataArray)) {
                    return prevDataArray.filter((data) => data.id !== documentId);
                }
                return [];
            });
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };



    console.log('dataArray --', dataArray)

    if (dataArray.length === 0) {
        return (
            <View className="bg-slate-950 flex-1">
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-12 left-5 shadow" style={{ marginTop: responsiveHeight(3) }}>
                    <View className=" bg-slate-700 rounded-full p-2">
                        <ArrowLeftIcon color="#ffffff" size={responsiveFontSize(2.4)} />
                    </View>
                </TouchableOpacity>
                <View style={{ alignItems: 'center', marginRight: responsiveWidth(5), marginTop: responsiveHeight(20) }}>
                    <LottieView
                        source={require('../assets/search.json')}
                        autoPlay
                        loop
                        style={{ width: responsiveWidth(60) }}
                    />
                    <Text className="text-slate-600 text-base">No Appointments Found</Text>
                </View>
            </View>
        );
    }

    // if there are 0 appointments render animated search icon
    return (
        <View className="flex-1 bg-slate-950">
            <View style={{ marginTop: responsiveHeight(7), flexDirection: 'row', marginLeft: responsiveWidth(5) }}>
                <TouchableOpacity onPress={() => navigation.goBack()} className=" shadow" >
                    <View className=" bg-slate-700 rounded-full" style={{ padding: responsiveWidth(1.5) }}>
                        <ArrowLeftIcon color="#ffffff" size={responsiveFontSize(2.4)} />
                    </View>
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold tracking-wide" style={{ marginBottom: responsiveWidth(10), marginLeft: responsiveWidth(5), marginTop: responsiveWidth(0.5) }}>Cancel Booking</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: responsiveWidth(5) }}>
                {dataArray.map((data) => (
                    <CancelComponent storename={data.storeName} date={data.date} time={data.time} day={data.day} handleDelete={handleDelete} docId={data.id} />
                ))}
            </ScrollView>
        </View>
    )
}

const CancelComponent = ({ storename, date, time, day, handleDelete, docId }) => {
    return (
        <View className="mb-5">
            {/* storename */}
            <View className="bg-slate-800 p-5 rounded-t-xl">
                <Text className="text-white font-bold text-base">{storename}</Text>
            </View>
            {/* date and time */}
            <View className="border-l-2 border-r-2 border-b-2 border-slate-800 bg-slate-900 p-5">
                <View className="border-dashed border-b border-slate-700">
                    <Text className="text-white mb-5 font-semibold" style={{ fontSize: 16 }}>{date} {day} at {time}</Text>
                </View>
                {/* cancel button */}
                <TouchableOpacity onPress={() => handleDelete(docId)} className="bg-white p-3 rounded-lg self-center mt-4">
                    <Text className="text-black font-semibold">Cancel Booking</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CancelBooking