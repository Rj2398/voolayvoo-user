"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "@/store/index";
import useLocalStorage, { removeStorage } from "@/constant/useLocalStorage";

export const UserContext = createContext(undefined);

export default function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    user_id: null,
    name: "",
    profile_image: "",
  });
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);

  useEffect(() => {
    async function fetch() {
      if (localStorage?.token && localStorage?.user_details?.user_id) {
        setIsAuthenticated(true);
        setUserDetails(localStorage?.user_details);
      }
    }
    fetch();
  }, []);

  const login = (data) => {
    console.log(data, "comes from dispatch");
    setIsAuthenticated(true);
    const newStoreData = {
      token: data.token,
      user_details: {
        token: data.token,
        email: data.email || "",
        user_id: data.user_id || "",
        ...data?.user_details[0],
      },
    };

    setLocalStorage(newStoreData);
    setUserDetails(newStoreData?.user_details);
  };

  const logout = async () => {
    await removeStorage("loginUser");
    setIsAuthenticated(false);
  };

  return (
    <Provider store={store}>
      <UserContext.Provider
        value={{ isAuthenticated, login, logout, userDetails }}
      >
        {children}
      </UserContext.Provider>
    </Provider>
  );
}

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
