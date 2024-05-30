import React, {useState} from 'react'
import './CreateAccount.css'
import { Link } from 'react-router-dom'
import { auth, database } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import logo from '../Images/icondarkblue.png'


export const CreateAccount = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser
            if (user) {
                await setDoc(doc(database, "Users", user.uid), { //store user uid in database named Users
                    email: user.email
                })
            }
            console.log("Create Account Successful")
        } catch(err) {
            console.log(err.message)
        }
    }

  return (
    <div className="create-account-container">
        <img src={logo} className="logo-create-account" alt={logo}/>
        <form className="create-account-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <div className="create-account-form-title">
                <label htmlFor="email">
                    Email:
                </label>
                <input type="text" className="form-input" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <br />
            <div className="create-account-form-title">
                <label htmlFor="password" >
                    Password:
                </label>
                <input type="password" onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <br />
            <br />
            <button type="submit">Create Account</button> 
            <br />
            <br />
            <Link to="/login" className='link-to-login'>Already Registered?</Link>
        </form>
    </div>
  )
}

export default CreateAccount
