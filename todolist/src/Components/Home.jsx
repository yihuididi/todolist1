import React, {useState, useEffect} from 'react'
import { auth, database } from '../firebase'
import { getDoc, doc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [userDetails, setUserDetails] = useState()
    const navigate = useNavigate()
    const getUserDetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user)
            const userDocs = await getDoc(doc(database, "Users", user.uid))
            if (userDocs.exists()) {
                setUserDetails(userDocs.data())
                console.log(userDocs.data())
            } else {
                console.log("User not found")
            }
        })
    }
    useEffect(() => {getUserDetails()}, [])

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login")
            console.log("User logged out Successfully!")
        } catch (err) {
            console.error("Error logging out", err.message)
        }
    }

  return (
    <div>
        {userDetails ? (
            <>
                <h1> {userDetails.email} todolist </h1>
                <button className="Logout-buttom" onClick={handleLogout}> Logout </button>
            </>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  )
}

export default Home