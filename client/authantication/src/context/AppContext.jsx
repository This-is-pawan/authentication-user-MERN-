import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  // Check authentication status

  const getAuthState = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      console.log(data);
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsLoggedin(false);
        toast.error("Unauthorized. Please log in.");
      } else {
        toast.error(error.message || "An error occurred.");
      }
    }
  };

  // Fetch user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`,{headers: { 'Content-Type': 'application/json' }
});
      console.log(data);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user data";
      toast.error(message);
    }
  };

  useEffect(() => {
    getAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};