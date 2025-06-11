// src/providers/NavigationContext.js
import React, { createContext, useContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [view, setView] = useState('Home'); // Home, SessionDetail, SetDetail
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  return (
    <NavigationContext.Provider
      value={{
        selectedSet, setSelectedSet,
        connectedDevice, setConnectedDevice,
        view, setView,
        selectedSessionId, setSelectedSessionId
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
