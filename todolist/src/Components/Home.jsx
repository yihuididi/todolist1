import React, {useState, useEffect} from 'react';
import { Sidebar } from './sidebar.jsx';
import { Utilitybar } from './utilitybar.jsx';
import { auth, database } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import './Home.css';

export const Home = () => {
    // User state
    const [userDetails, setUserDetails] = useState();

    // User's pages
    const [pages, setPages] = useState();

    const navigate = useNavigate();
    const getUserDetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            // If signed in,...
            if (user) {
                const userRef = doc(database, "Users", user.uid);

                // Set user details if it exist
                const userDocs = await getDoc(userRef);
                if (userDocs.exists()) {
                    setUserDetails(userDocs.data());
                    console.log(userDocs.data());
                } else {
                    console.log("User not found");
                }

                // Get user's pages if they exists
                try {
                    const userPages = await getDocs(collection(userRef, "Pages"));
                    setPages(userPages.docs.map(page => ({
                        ...page.data(),
                        id: page.id,
                    })));
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };
    useEffect(() => {getUserDetails()}, []);

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
        <div className="home">
            {!userDetails  || !pages? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* sidebar navigation */}
                    <Sidebar user={userDetails} pages={pages} handleLogout={handleLogout} />

                    {/* main content */}
                    <div className="main-content">
                        {/* Utilities bar on top of page */}
                        <Utilitybar user={userDetails} />

                        <h1>Content goes here.</h1>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home
