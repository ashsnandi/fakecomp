// src/contexts/CityDataContext.js
import React, { createContext, useState } from 'react';

export const CityDataContext = createContext();

export const CityDataProvider = ({ children }) => {
  const [cityData, setCityData] = useState(null); // will store parsed CSV data

  return (
    <CityDataContext.Provider value={{ cityData, setCityData }}>
      {children}
    </CityDataContext.Provider>
  );
};
