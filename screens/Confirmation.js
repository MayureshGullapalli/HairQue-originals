import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Confirmation = () => {
    const [isVisible, setIsVisible] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000); // 5000 milliseconds = 5 seconds
        return () => clearTimeout(timer); // Cleanup function to clear the timer on unmount
    }, []);

    if (!isVisible) {
        return navigation.navigate('Home'); // Return null to render nothing once the screen is hidden
    }

    return (
        <View className="flex-1 bg-slate-800">
            <LottieView
                source={require('../assets/done.json')}
                autoPlay
                loop
            />

        </View>
    )
}


export default Confirmation