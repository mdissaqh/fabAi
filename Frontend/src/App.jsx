import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hook/useAuth';

const App = () => {
  const {getMeHandler}=useAuth()
  const {user}=useSelector((state)=>state.auth)
  useEffect(()=>{
    getMeHandler()
  },[])
  useEffect(() => {
        console.log(user)
    }, [user]);
  return (
    <RouterProvider router={router}/>
  )
}

export default App
