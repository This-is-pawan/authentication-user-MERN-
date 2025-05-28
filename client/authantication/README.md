### app.jsx
```js
import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerfiy from './pages/EmailVerify'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ResetPassword  from './pages/ResetPassword'
const App = () => {
  return (
    <div>
      <ToastContainer position="top-right"
  autoClose={2000}
  />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerfiy/>}/>
        <Route path='/reset-password' element={< ResetPassword/>}/>
      </Routes>

      </div>
  )
}

export default App
```
### appContext.jsx
```js
import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext=createContext()


export const AppContextProvider=(props)=>{
 const backendUrl=import.meta.env.VITE_BACKEND_URL
 const [isLoggedin,setIsLoggedin]=useState(false)
 const [userData,setUserData]=useState(false)
 const value={
backendUrl,
isLoggedin,setIsLoggedin,
userData,setUserData
 }
return (
 <AppContext.Provider value={value}>
{props.children}
 </AppContext.Provider>
)
}
```
### Login.jsx
```js
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log({ name, password, email });

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); // fixed typo here
      axios.defaults.withCredentials = true; // send cookie

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          toast.success("Register successful!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          navigate("/");
         toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from blue-200 to bg-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute lef-5 sm:left-20 top-5 w-28 sm:32 cursor-pointer "
        onClick={() => navigate("/")}
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg wi-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "create  account" : "login your account"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up" ? "create your account" : "login your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {/*username*/}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name "
                required
                className="bg-transparent outline-none "
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </div>
          )}

          {/*  mail*/}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id "
              required
              className="bg-transparent outline-none "
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          {/*password*/}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password "
              required
              className="bg-transparent outline-none "
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </div>
          <p
            className="   mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400  to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400  text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400  text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

```
