import React from "react";

/**
 * 
 * @param defaultValue Default value to store
 * @param key The local storage key
 * @returns value and setValue as per React.useState
 */
export function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<T>] {
    const [value, setValue] = React.useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    });
    
    React.useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    
    return [value, setValue];
}