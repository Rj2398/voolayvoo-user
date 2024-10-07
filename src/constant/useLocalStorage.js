"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

function getStorageValue(key, defaultValue) {
  // getting stored value
  let saved = null;
  if (typeof window !== "undefined") {
    saved = localStorage.getItem(key);
  }

  const initial = saved ? JSON.parse(saved) : defaultValue;
  return initial;
}

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

export const removeStorage = (keyName) => {
  localStorage.removeItem(keyName);
};
