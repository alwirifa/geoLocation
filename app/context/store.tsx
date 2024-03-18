"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface ContextProps {
  language: 'en' | 'id';
  toggleLanguage: () => void;
}

const GlobalContext = createContext<ContextProps>({
  language: 'en',
  toggleLanguage: () => {},
})

type GlobalContextProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [language, setLanguage] = useState<'en' | 'id'>('en');

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'id' : 'en'));
  };

  const value: ContextProps = {
    language,
    toggleLanguage,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
