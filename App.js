import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import StoreScreen from './screens/StoreScreen';
import Booking from './screens/Booking';
import 'react-native-url-polyfill/auto';
import Confirmation from './screens/Confirmation';
import CancelBooking from './screens/CancelBooking';
import PhoneLogin from './screens/PhoneLogin';
import NameScreen from './screens/NameScreen';
import Profile from './screens/Profile';
import { PhoneNumberProvider } from './PhoneNumberContext';
import { AuthProvider } from './AuthContext';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util';
import React, { useEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AppointmentProvider } from './AppointmentContext';
import CameraScreen from './screens/CameraScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        console.log('User successfully logged in ');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };

  return (
    // rendering a screens and explicitly configurating and changed its settings
    <PhoneNumberProvider>
      <AuthProvider>
        <AppointmentProvider>
          <NavigationContainer>
            <StatusBar style='light' />
            <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }}>
              {!isLoggedIn ? (
                <>
                  <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
                  <Stack.Screen name="NameScreen" component={NameScreen} initialParams={{
                    isLoggedIn: isLoggedIn,
                    setIsLoggedIn: setIsLoggedIn,
                  }} />
                  <Stack.Screen name="Home" component={HomeScreen} initialParams={{
                    isLoggedIn: isLoggedIn,
                  }} />
                  <Stack.Screen name="Store" component={StoreScreen} initialParams={{
                    isLoggedIn: isLoggedIn,
                  }} />
                  <Stack.Screen name="Booking" component={Booking} />
                  <Stack.Screen name="Confirmation" component={Confirmation} />
                  <Stack.Screen name="CancelBooking" component={CancelBooking} initialParams={{
                    isLoggedIn: isLoggedIn,
                  }} />
                  <Stack.Screen name="Profile" component={Profile}
                    initialParams={{
                      isLoggedIn: isLoggedIn,
                      setIsLoggedIn: setIsLoggedIn,
                    }}
                  />
                  <Stack.Screen name="CameraScreen" component={CameraScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} initialParams={{
                    isLoggedIn: isLoggedIn,
                  }} />
                  <Stack.Screen name="Store" component={StoreScreen} />
                  <Stack.Screen name="Booking" component={Booking} />
                  <Stack.Screen name="Confirmation" component={Confirmation} />
                  <Stack.Screen name="CancelBooking" component={CancelBooking} />
                  <Stack.Screen name="Profile" component={Profile}
                    initialParams={{
                      isLoggedIn: isLoggedIn,
                      setIsLoggedIn: setIsLoggedIn,
                    }}
                  />
                  <Stack.Screen name="CameraScreen" component={CameraScreen} />
                </>
              )}

              {/* <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
              <Stack.Screen name="NameScreen" component={NameScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Store" component={StoreScreen} />
              <Stack.Screen name="Booking" component={Booking} />
              <Stack.Screen name="Confirmation" component={Confirmation} />
              <Stack.Screen name="CancelBooking" component={CancelBooking} />
              <Stack.Screen name="Profile" component={Profile} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </AppointmentProvider>
      </AuthProvider>
    </PhoneNumberProvider>
  );
}