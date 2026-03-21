import React from 'react'
import { Link, useNavigate } from 'react-router'
import '../styles/register.scss'
import { useState } from 'react';
import { useAuth } from '../hook/useAuth';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { registerHandler } = useAuth()

    const navigate = useNavigate()
    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    async function submitHandler(e) {
        e.preventDefault()
        await registerHandler({ username,email, password })
        navigate("/")
    }
    return (
        <div className="register-form-container">
            <form onSubmit={submitHandler}>
                <h1>Register for Fab AI</h1>
                <input
                    value={username}
                    onChange={(e) => [
                        setUsername(e.target.value)
                    ]}
                    type="text" placeholder="Enter your Username" />
                <input
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    value={email} type="email" placeholder="Enter your email" />
                <div className="password-input-wrapper">
                    <input
                        value={password}
                        onChange={(e) => {
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
                <button>Register</button>
            </form>
            <p>Already have an account? <Link to={"/login"}>Log In</Link></p>
        </div>
    )
}

export default Register
