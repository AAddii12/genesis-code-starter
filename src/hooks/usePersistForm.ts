
import { useState, useEffect } from 'react';

/**
 * A hook for persisting form data in localStorage
 * 
 * @param key The localStorage key to store the data under
 * @param initialValue The initial value if no data is found in localStorage
 * @returns A tuple with the form data and a setter function
 */
export const usePersistForm = <T>(key: string, initialValue: T) => {
  // Initialize state from localStorage or fall back to initialValue
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  // Clear data from localStorage
  const clearPersistedData = () => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return [value, setValue, clearPersistedData] as const;
};
