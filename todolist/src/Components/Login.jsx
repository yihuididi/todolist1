import React, {useState} from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import {auth} from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        await signInWithEmailAndPassword(auth, email, password)
        console.log("Login Successfully")
      } catch(err) {
        console.log(err)
      }
    }

  return (
    <div className='login-container'>  
         <form className='login-form' onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div class="login-form-title">
                <label htmlFor="email">
                    Email:
                </label>
                <input type="text" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <br />
            <div class="login-form-title">
                <label htmlFor="password" >
                    Password:
                </label>
                <input type="password" onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <br />
            <br />
            <button type="submit">Login</button> 
            <br />
            <br />
            <Link to="/create-account" className='link-to-create-account'>Dont't have an account?</Link>
        </form>
    </div>
  )
}

export default Login
