import React from 'react'
import { Routes, Route } from 'react-router'
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Notifications from "./components/Notifications"
import Call from "./components/Call"
import Chat from "./components/Chat"
import Onboarding from "./components/Onboarding"
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


const App = () => {
  const {data,isLoading,error} = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos')
      return res.data
      
    }
  })
  console.log({data})
  console.log({isLoading})
  console.log({error})
  return (
    <>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/call" element={<Call/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/onboarding" element={<Onboarding/>}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App