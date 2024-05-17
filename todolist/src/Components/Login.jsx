import React, {useState} from 'react'
import './CreateAccount.css'
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
    <div className='create-account'>
        <form className='create-account-form' onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label htmlFor="email">
                Email:
                <input type="text" onChange={(event) => setEmail(event.target.value)}/>
            </label>
            <label htmlFor="password" >
                Password:
                <input type="password" onChange={(event) => setPassword(event.target.value)}/>
            </label>
            <button type="submit">Login</button> 
            <br />
            <p>Don't have an account?  <Link to="/create-account">Create Account</Link></p>
        </form>
    </div>
  )
}

export default Login
