import React, { useState, createContext } from 'react';
import { translations } from '../translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {

    const [currentLang, setCurrentLang] = useState('AM');

    const t = (key) => translations[currentLang][key] || key;

    const contextValue = {
        currentLang,
        setCurrentLang,
        t,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};