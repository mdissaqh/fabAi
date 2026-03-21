import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import '../styles/login.scss'
import { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';

const Login = () => {
  const {user,loading}=useSelector((state)=>state.auth)
    const [showPassword, setShowPassword] = useState(false);
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const {loginHandler}=useAuth()

    const navigate=useNavigate()

    const togglePasswordVisibility = (e) => {
    e.preventDefault(); 
    setShowPassword(!showPassword);
  };
  async function submitHandler(e) {
    e.preventDefault()
    await loginHandler({email,password})
    navigate("/")
  }
  if(!loading && user){
    return <Navigate to={"/"}/>
  }
  return (
    <div className="login-form-container">
        <form onSubmit={submitHandler}>
            <h1>Log in to Fab AI</h1>
            <input
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
            value={email} type="email" placeholder="Enter your email" />
            <div className="password-input-wrapper">
                <input 
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}  
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password" 
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <button  className='submit-button'>Log in</button>
        </form>
        <p>New to perplexity? <Link to={"/register"}>Register</Link></p>
    </div>
  )
}

export default Login
