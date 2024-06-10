import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, query, where,
    orderBy, startAt, endAt, serverTimestamp } from 'firebase/firestore';
import Sidebar from './sidebar.jsx';
import Utilitybar from './utilitybar.jsx';
import Settings from './settings.jsx';
import Page from './Page.jsx';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home = () => {
    const [userDetails, setUserDetails] = useState();
    const [pages, setPages] = useState([]);
    const [selectedPageData, setSelectedPageData] = useState(null);
    const [blocks, setBlocks] = useState([]);

    const navigate = useNavigate();

    const getUserDetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = doc(database, 'Users', user.uid);
                const userDocs = await getDoc(userRef);
                if (userDocs.exists()) {
                    setUserDetails(userDocs.data());
                    const userPages = await getDocs(query(collection(userRef, 'Pages'), orderBy('lastEdited', 'desc')));
                    setPages(userPages.docs.map(page => ({ ...page.data(), id: page.id })));
                } else {
                    console.log('User not found');
                }
            }
        });
    };
    useEffect(() => {getUserDetails()}, []);

    useEffect(() => {
        const fetchBlocks = async () => {
            if (selectedPageData) {
                const blocksSnapshot = await getDocs(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks'));
                setBlocks(blocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        fetchBlocks();
    }, [selectedPageData?.id]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (err) {
            console.error('Error logging out', err.message);
        }
    };

    const handlePageSelect = (page) => {
        setSelectedPageData(page);
        console.log(page);
    };

    /**
     * Adds a new page to current user with page name 'New Page'.
     * If 'New Page' already exists, use 'New Page(1)', 'New Page(2)', and so on.
     * Navigates user to new page created.
     */
    const addPage = async () => {
        const defaultPageName = 'New Page';
        const pageRef = collection(database, 'Users', auth.currentUser.uid, 'Pages');

        // Get all pages whose name starts with 'New Page'
        const pageNamesThatStartsWithNewPage = await getDocs(
            query(
                pageRef,
                orderBy('name'),
                startAt(defaultPageName),
                endAt(`${defaultPageName}\uf8ff`)
            )
        ).then(pages => pages.docs)
        .then(pages => pages.map(page => page.data().name));

        // The name of the new page created.
        let newPageName = defaultPageName;

        // Checks if the defaultPageName is already taken.
        // If so, use 'New Page(1)', 'New Page(2)', and so on.
        let count = 1;
        while (pageNamesThatStartsWithNewPage.includes(newPageName)) {
            newPageName = defaultPageName + '(' + count + ')';
            count++;
        }

        // The new page to be added to firestore once unique page name has been found.
        const newPage = {
            name: newPageName,
            createdOn: serverTimestamp(),
            lastEdited: serverTimestamp()
        };

        // Add newPage to firestore and update pages
        try {
            const np = await addDoc(pageRef, newPage).then(doc => getDoc(doc));
            setPages(prevPages => [{ ...np.data(), id: np.id }, ...prevPages]);

            // Navigates user to new page created.
            setSelectedPageData(np);
        } catch (err) {
            console.error(err);
        }

    };

    /**
     * Deletes selected page from firestore.
     */
    const deletePage = async (page) => {
        await deleteDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', page.id));
        setPages(prevPages => prevPages.filter(p => p.id != page.id));
    }

    /**
     * Make changes to the specific page, where page.field = value.
     * Does not validate value.
     * Handles exceptions by logging them in console.
     */
    const updatePage = async (page, field, value) => {
        try {
            await updateDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', page.id), {[field]: value});
            setPages(prevPages => prevPages.map(p => {
                if (p.id == page.id) {
                    p[field] = value;
                }
                return p;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const addBlock = async (heading, color) => {
        if (selectedPageData) {
            const newBlockRef = doc(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks'));
            const newBlock = {
                heading,
                color,
                tasks: []
            };
            await setDoc(newBlockRef, newBlock);
            setBlocks([...blocks, { id: newBlockRef.id, ...newBlock }]);
        }
    };

    const updateBlock = async (blockId, updatedBlock) => {
        if (selectedPageData) {
            const blockRef = doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks', blockId);
            await setDoc(blockRef, updatedBlock, { merge: true });
            setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updatedBlock } : block));
        }
    };

    const deleteBlock = async (blockId) => {
        if (selectedPageData) {
            await deleteDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks', blockId));
            setBlocks(blocks.filter(block => block.id !== blockId));
        }
    };

    return (
        <div>
            {!userDetails || !pages ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="home">
                        {/* Load sidebar */}
                        <Sidebar
                            user={userDetails}
                            pages={pages}
                            handleLogout={handleLogout}
                            onPageSelect={handlePageSelect}
                        />
                        
                        <div className="main-content">

                            {/* Load top utility bar */}
                            <Utilitybar
                                user={userDetails}
                                addPage={addPage}
                                selectedPage={selectedPageData}
                                deletePage={deletePage}
                                handlePageSelect={handlePageSelect}
                            />

                            {/* Load selected page info */}
                            {selectedPageData ? (
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

                    </div>

                    {/* This div is for popup when user select settings. */}
                    {/* It has to be placed outside of .home to not get affected by blur effect. */}
                    <div className="settings-popup">
                        <Settings
                            pages={pages}
                            page={selectedPageData}
                            updatePage={updatePage}
                        />
                    </div>
                </>
            )}
        </div>
        
    );
};

export default Home;

