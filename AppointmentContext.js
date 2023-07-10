import React, { createContext, useState } from 'react';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointmentCount, setAppointmentCount] = useState(0);

  const updateAppointmentCount = (count) => {
    setAppointmentCount(count);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointmentCount,
        updateAppointmentCount,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContext;
