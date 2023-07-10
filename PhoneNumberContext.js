import React, { createContext, useState } from 'react';

// Create the context
export const PhoneNumberContext = createContext();

// Create a provider component to wrap your app
export const PhoneNumberProvider = ({ children }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [active, setActive] = useState(false);

    return (
        <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber, active, setActive }}>
            {children}
        </PhoneNumberContext.Provider>
    );
};


// export const LogoutProvider = ({ children }) => {

//     return (
//         <logoutContext.Provider value={{ active, setActive }}>
//             {children}
//         </logoutContext.Provider>
//     );
// }