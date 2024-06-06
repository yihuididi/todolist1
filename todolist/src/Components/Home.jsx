import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import Sidebar from './sidebar.jsx';
import Utilitybar from './utilitybar.jsx';
import Page from './Page.jsx';
import { useNavigate } from "react-router-dom";
import './Home.css';

export const Home = () => {
    const [userDetails, setUserDetails] = useState();
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [blocks, setBlocks] = useState([]);

    const navigate = useNavigate();

    const getUserDetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = doc(database, "Users", user.uid);

                const userDocs = await getDoc(userRef);
                if (userDocs.exists()) {
                    setUserDetails(userDocs.data());
                    const userPages = await getDocs(collection(userRef, "Pages"));
                    setPages(userPages.docs.map(page => ({ ...page.data(), id: page.id })));
                } else {
                    console.log("User not found");
                }
            }
        });
    };
    useEffect(() => {getUserDetails()}, []);

    useEffect(() => {
        const fetchBlocks = async () => {
            if (selectedPageId) {
                const blocksSnapshot = await getDocs(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageId, 'Blocks'));
                setBlocks(blocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        fetchBlocks();
    }, [selectedPageId]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (err) {
            console.error("Error logging out", err.message);
        }
    };

    const handlePageSelect = (pageId) => {
        setSelectedPageId(pageId);
    };

    const addBlock = async (heading, color) => {
        const newBlockRef = doc(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageId, 'Blocks'));
        const newBlock = {
            heading,
            color,
            tasks: []
        };
        await setDoc(newBlockRef, newBlock);
        setBlocks([...blocks, { id: newBlockRef.id, ...newBlock }]);
    };

    const updateBlock = async (blockId, updatedBlock) => {
        const blockRef = doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageId, 'Blocks', blockId);
        await setDoc(blockRef, updatedBlock, { merge: true });
        setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updatedBlock } : block));
    };

    const deleteBlock = async (blockId) => {
        await deleteDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageId, 'Blocks', blockId));
        setBlocks(blocks.filter(block => block.id !== blockId));
    };

    return (
        <div className="home">
            {!userDetails || !pages ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Sidebar user={userDetails} pages={pages} handleLogout={handleLogout} onPageSelect={handlePageSelect} />
                    <div className="main-content">

                        {/* Load top utility bar */}
                        <Utilitybar user={userDetails} />

                        {selectedPageId ? (
                            <Page 
                                blocks={blocks} 
                                addBlock={addBlock} 
                                updateBlock={updateBlock} 
                                deleteBlock={deleteBlock} 
                            />
                        ) : (
                            <h1>Select a page to view its content</h1>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;


