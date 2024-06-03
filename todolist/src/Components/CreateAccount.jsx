import React, {useState} from 'react'
import styles from './CreateAccount.module.css'
import { Link } from 'react-router-dom'
import { auth, database } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import logo from '../Images/icondarkblue.png'
import { toast } from "react-toastify"


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
            toast.success("Account Created!")
            console.log("Create Account Successful")
        } catch(err) {
            toast.error(err.message)
            console.log(err.message)
        }
    }

  return (
    <div className={styles.createaccountcontainer}>
        <img src={logo} className={styles.logocreateaccount} alt={logo}/>
        <form className={styles.createaccountform} onSubmit={handleSubmit}>
            <h2 className={styles.createaccountformh2}>Create Account</h2>
            <div className={styles.createaccountformtitle}>
                <label htmlFor="email" className={styles.createaccountformlabel}>
                    Email:
                </label>
                <input type="text" className={styles.createaccountforminput} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <br />
            <div className={styles.createaccountformtitle}>
                <label htmlFor="password" className={styles.createaccountformlabel}>
                    Password:
                </label>
                <input type="password" className={styles.createaccountforminput} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <br />
            <br />
            <button type="submit" className={styles.createaccountformbutton}>Create Account</button> 
            <br />
            <br />
            <Link to="/login" className={styles.linktologin}>Already Registered?</Link>
        </form>
    </div>
  )
}

export default CreateAccount
