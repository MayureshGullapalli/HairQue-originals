import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setPhoneNumber(user.phoneNumber);
      } else {
        setUser(null);
        setPhoneNumber(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, phoneNumber }}>
      {children}
    </AuthContext.Provider>
  );
};
