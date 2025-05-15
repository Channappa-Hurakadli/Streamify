import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/SignUp"
import Notifications from "./pages/Notifications"
import Call from "./pages/Call"
import Chat from "./pages/Chat"
import Onboarding from "./pages/Onboarding"
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import {axiosInstance} from './lib/axios'


const App = () => {
  const {data:userData,isLoading,error} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me")
      return res.data
    },
    retry:false,
  })
  const authUser = userData?.user;
  return (
    <>

      <Routes>
        <Route path="/" element={authUser?<Home/>:<Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser?<Login/>:<Navigate to="/"/>}/>
        <Route path="/signup" element={!authUser?<Signup/>:<Navigate to="/"/>}/>
        <Route path="/notifications" element={authUser?<Notifications/>:<Navigate to="/login"/>}/>
        <Route path="/call" element={authUser?<Call/>:<Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser?<Chat/>:<Navigate to="/login"/>}/>
        <Route path="/onboarding" element={authUser?<Onboarding/>:<Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App