import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { days } from '../dateTime';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const AppointmentDate = ({ date, setSelectedDate, selectedDate }) => {
    // appointment date is handled here

    const selectDate = (id) => {
        if (selectedDate === id) {
            setSelectedDate(0)
        } else {
            setSelectedDate(id)
        }
    }

    // console.log(days)

    return (
        <>
            {/* displaying 7 days from current date */}
            {days.map((day) => (
                <TouchableOpacity activeOpacity={1} onPress={() => selectDate(day.id, day.date)}>
                    <View style={{ width: responsiveWidth(15), height: responsiveWidth(20) }} className={selectedDate == day.id ? " bg-white w-20 p-3 rounded-lg mt-5 mr-5 h-24 flex-col justify-center" : "bg-slate-900 w-20 p-3 rounded-lg mt-5 mr-5 h-24 flex-col justify-center"}>
                        <Text className={selectedDate == day.id ? "text-black text-center mb-2 font-bold text-lg" : "text-white text-center mb-2 font-bold text-lg"}>{day.date}</Text>
                        <Text className={selectedDate == day.id ? "text-black text-center" : "text-white text-center"}>{day.dayOfWeek}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    );
}

export default AppointmentDate