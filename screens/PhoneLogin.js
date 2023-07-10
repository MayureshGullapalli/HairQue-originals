import { View, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import Authentication from '../components/Authentication';
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import AuthenticateCode from '../components/AuthenticateCode'
import { PhoneNumberContext } from '../PhoneNumberContext';

const PhoneLogin = ({ route }) => {
    const navigation = useNavigation();

    // const [phoneNumber, setPhoneNumber] = useState('');
    const { phoneNumber, setPhoneNumber } = useContext(PhoneNumberContext);

    // verificationId generated when phone number submitted to firebase
    const [verificationId, setVerificationId] = useState(null);

    // otp stored here from firebase
    const [otp, setOtp] = useState('')

    // checks to render phonenumber input component or otp component
    const { active, setActive } = useContext(PhoneNumberContext)

    // loading is used to load until the screen processed the preceding work
    const [loading, setLoading] = useState(false); // Add loading state

    // verifies the captcha
    const recaptchaVerifier = useRef(null);

    // phone number will be sent to firebase and gets the verification Id to verify the otp
    const handleSendVerificationCode = async () => {
        try {
            setLoading(true);
            const fullPhoneNumber = `+91${phoneNumber}`;
            const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
            const verificationId = await phoneProvider.verifyPhoneNumber(
                fullPhoneNumber,
                recaptchaVerifier.current
            ); // get the verification id
            setVerificationId(verificationId); // set the verification id
            setLoading(false);
            console.log("verificationId --" + verificationId)

            // console.log(formatedPhoneNumber)
            console.log('Success : Verification code has been sent to your phone'); // If Ok, show message.
            setActive(false);
        } catch (error) {
            setLoading(false);
            alert(error);
            console.log(error); // show the error
        }
    };

    // verifies the entered otp is valid or not
    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            const credential = PhoneAuthProvider.credential(verificationId, otp); // get the credential
            console.log(credential)
            await signInWithCredential(auth, credential); // verify the credential
            console.log('Success: Phone authentication successful'); // if OK, set the message
            setActive(true)
            setLoading(false);
            navigation.navigate("NameScreen"); // navigate to the name screen
        } catch (error) {
            setLoading(false);
            alert(error)
            console.log(`Error : ${error.message}`); // show the error.
        }
    }

    return (
        <View className="bg-slate-950 flex-1">
            <View style={{ marginVertical: responsiveHeight(25), marginHorizontal: responsiveWidth(5) }}>
                {/* if loading is true renders the phone input screen else otp screen */}
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: responsiveHeight(20) }} /> // Render activity indicator if loading is true
                ) : verificationId === null || active === true ? (
                    <Authentication phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} validateOtp={handleSendVerificationCode} />
                ) : (
                    <AuthenticateCode otp={otp} setOtp={setOtp} verifyOtp={handleVerifyCode} />
                )}

                {/* captch screen renders after submitting the phone number to firebase */}
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={auth.app.options}
                />
            </View>
        </View>
    )
}



export default PhoneLogin