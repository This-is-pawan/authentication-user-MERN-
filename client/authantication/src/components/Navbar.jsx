import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
  try {
    // Ensure credentials like cookies are sent with requests
    axios.defaults.withCredentials = true;

    // Make the POST request to send OTP
    const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`,{
        withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response?.data;

    // Check for success
    if (data?.success) {
      toast.success(data.message || "OTP sent successfully!");
      navigate("/email-verify");
    } else {
      toast.error(data?.message || "Failed to send OTP.");
    }
  } catch (error) {
    // Handle possible errors from server or network
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    toast.error(errorMessage);
  }
};


  const logout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/logout`,{
          withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
      if (response.data.success) {
        toast.success(response.data.message || "Logout successful");
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full flex justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={`${backendUrl}/assets.logo`} alt="logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="relative group">
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer">
            {userData.name?.charAt(0).toUpperCase()}
          </div>
          <ul className="absolute hidden group-hover:block right-0 top-10 bg-white shadow rounded text-sm z-50 min-w-[120px]">
            {!userData.isAccountVerified && (
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={sendVerificationOtp}
              >
                Verify Email
              </li>
            )}
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={logout}
            >
              Logout
            </li>
          </ul>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={`${backendUrl}/assets.arrow_icon`} alt="arrow-icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
