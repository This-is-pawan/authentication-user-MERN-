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