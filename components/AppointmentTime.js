import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { times } from '../dateTime'
import { responsiveWidth } from 'react-native-responsive-dimensions';

const AppointmentTime = ({ selectedTime, setSelectedTime }) => {
  // time select deselection functionality

  const selectTime = (id) => {
    if (selectedTime === id) {
      setSelectedTime(0); // Deselect the component if already selected
    } else {
      setSelectedTime(id); // Select the component if not disabled
    }
  };

  return (
    <>
      {/* rendering all time 1hour timeframe slots for booking */}
      {
        times.map((time) => (
          <TouchableOpacity key={time.id} activeOpacity={1} onPress={() => selectTime(time.id)}>
            <View style={{ width: responsiveWidth(15), height: responsiveWidth(8), padding: responsiveWidth(1) }} className={selectedTime === time.id ? "mt-5 bg-white rounded-xl justify-center mr-5" : "mt-5 bg-slate-800 rounded-xl justify-center mr-5"}>
              <Text className="text-gray-500 font-bold text-center">{time.roundOffTime}</Text>
            </View>
          </TouchableOpacity >
        ))
      }
    </>
  );
}

export default AppointmentTime
