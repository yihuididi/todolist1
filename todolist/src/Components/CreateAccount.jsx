import React, {useState} from 'react'
import './CreateAccount.css'
import { Link } from 'react-router-dom'
import {auth} from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const CreateAccount = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            console.log("Login Successfully")
        } catch(err) {
            console.log(err)
        }
    }

  return (
    <div className='create-account-container'>
        <form className='create-account-form' onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <div class="form-title">
                <label htmlFor="email">
                    Email:
                </label>
                <input type="text" class="form-input" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <br />
            <div class="form-title">
                <label htmlFor="password" >
                    Password:
                </label>
                <input type="password" class="form-input" onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <br />
            <br />
            <button type="submit">Create Account</button> 
            <br />
            <br />
            <Link to="/login" className="link">Already Registered?</Link>
        </form>
    </div>
  )
}

export default CreateAccount
