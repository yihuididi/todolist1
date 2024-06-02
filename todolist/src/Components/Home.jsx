import logo from '../Images/icondarkblue.png'
import React, {useState, useEffect} from 'react';
import thumbnail from '../Images/thumbnail.png';
import { auth, database } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import './Home.css';

export const Home = () => {
    // User state
    const [userDetails, setUserDetails] = useState();

    // User blogs
    const [blogs, setBlogs] = useState();

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

                // Get user's blogs if they exists
                try {
                    const userBlogs = await getDocs(collection(userRef, "Blogs"));
                    setBlogs(userBlogs.docs.map(blog => ({
                        ...blog.data(),
                        id: blog.id,
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
        <div>
            {userDetails ? (
                <>
                    {/* topbar with logo and logout buttons. */}
                    <div className="container-fluid top-bar">
                        <Link to="">
                            <img className="home-logo" src={logo} alt="logo"/>
                        </Link>
                        <button className="Logout-button float-end" onClick={handleLogout}>Logout</button>
                    </div>

                    {/* div for greeting logged in user. */}
                    <div className="container mx-auto text-center greeting">
                        <h1 id="greeting">Good day, {userDetails.email}</h1>
                    </div>

                    {/* div for listing out all user's created blogs. */}
                    <div className="container mx-auto text-center">
                        <div className="row row-cols-4">
                            {blogs?.map(blog => (
                                <div className="col">
                                    <img class="thumbnail" src={thumbnail} alt="thumbnail"/>
                                    <h6>{blog.name}</h6>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Home