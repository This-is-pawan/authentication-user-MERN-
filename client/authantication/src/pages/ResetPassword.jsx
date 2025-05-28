import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },{
            withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) {
        setIsEmailSent(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value).slice(0, 6);
    const finalOtp = otpArray.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    setOtpValue(finalOtp);
    setIsOtpSubmited(true);
    toast.success("OTP verified. Now set your new password.");
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp: otpValue,
          newPassword: password,
        }
        ,{
           withCredentials: true,
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
      );
      data.success
        ? toast.success("Password successfully changed.")
        : toast.error(data.message);
      if (data.success) {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Email Step */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Your Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your Registered Email Address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="" className="cursor-not-allowed" />
            <input
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* OTP Step */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your Email
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-900 rounded-full text-white font-semibold"
          >
            Submit
          </button>
        </form>
      )}

      {/* New Password Step */}
      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="" className="cursor-not-allowed" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
