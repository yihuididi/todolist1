import React, {useState} from 'react'
import styles from './Login.module.css'
import { Link } from 'react-router-dom'
import {auth} from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import logo from '../Images/iconbeige.png'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/home")
      } catch(err) {
        toast.error(err.message)
        console.log(err.message)
      }
    }

  return (
    <div className={styles.logincontainer}>
      <img src={logo} className={styles.logologin} alt={logo}/> 
        <form className={styles.loginform} onSubmit={handleSubmit}> 
          <h2 className={styles.loginformh2}>Login</h2>
          <div className={styles.loginformtitle}>
            <label htmlFor="email" className={styles.loginformlabel}>
                Email:
            </label>
            <input type="text" className={styles.loginforminput} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <br />
          <div className={styles.loginformtitle}>
            <label htmlFor="password" className={styles.loginformlabel}>
                Password:
            </label>
            <input type="password" className={styles.loginforminput} onChange={(event) => setPassword(event.target.value)}/>
          </div>
          <br />
          <br />
          <button type="submit" className={styles.loginformbutton}>Login</button> 
          <br />
          <br />
          <Link to="/create-account" className={styles.linktocreateaccount}>Don't have an account?</Link>
        </form>
    </div>
  )
}

export default Login
