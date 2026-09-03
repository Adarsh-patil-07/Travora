import React, { createContext, useContext, useState } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstUSD: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', flag: '🇮🇳', rateAgainstUSD: 86.5 },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', flag: '🇺🇸', rateAgainstUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', flag: '🇪🇺', rateAgainstUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', flag: '🇬🇧', rateAgainstUSD: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', flag: '🇯🇵', rateAgainstUSD: 152.0 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', flag: '🇦🇪', rateAgainstUSD: 3.67 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)', flag: '🇦🇺', rateAgainstUSD: 1.55 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)', flag: '🇨🇦', rateAgainstUSD: 1.40 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)', flag: '🇸🇬', rateAgainstUSD: 1.34 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)', flag: '🇨🇭', rateAgainstUSD: 0.88 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('travora_currency');
    return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0]; // Default INR
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('travora_currency', newCurrency.code);
  };

  const formatPrice = (amountInUSD: number) => {
    const converted = Math.round(amountInUSD * currency.rateAgainstUSD);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
