import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, query, where,
    orderBy, startAt, endAt, serverTimestamp, writeBatch } from 'firebase/firestore';
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

    // To handle animation for sidebar
    const [newPage, setNewPage] = useState(null);
    const [deletedPage, setDeletedPage] = useState(null);

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
                // order the blocks by its order field
                const blocksSnapshot = await getDocs(query(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks'), orderBy('order')));
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
    };

    // Ensure block stays in place after being dragged
    const handleOnDragEnd = async (result) => {
        
        // if drag block outside of container, return 
        if (!result.destination) return;
        
        // create new array of reordered blocks
        const reorderedBlocks = Array.from(blocks);
        
        // find and remove moved block from its orginal index in the reorderedBlocks array
        const [reorderedBlock] = reorderedBlocks.splice(result.source.index, 1);
        
        // inject the block back into the array at destination index
        reorderedBlocks.splice(result.destination.index, 0, reorderedBlock);

        setBlocks(reorderedBlocks);

        // update order of blocks in firestore
        const batch = writeBatch(database);
        reorderedBlocks.forEach((block, index) => {
            const blockRef = doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks', block.id);
            batch.update(blockRef, { order: index });
        });
        await batch.commit();
    };

    /**
     * Adds a new page to current user with page name 'New Page'.
     * If 'New Page' already exists, use 'New Page(1)', 'New Page(2)', and so on.
     * Returns new page data if successful.
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
        let np = {
            name: newPageName,
            createdOn: serverTimestamp(),
            lastEdited: serverTimestamp()
        };

        // Add newPage to firestore and update pages
        try {
            np = await addDoc(pageRef, np).then(doc => getDoc(doc));
            np = { ...np.data(), id: np.id };
            setSelectedPageData(np);
            setNewPage(np);
            setPages(prevPages => [np, ...prevPages]);
            return np;
        } catch (err) {
            console.error(err);
        }

    };

    /**
     * Deletes selected page from firestore.
     */
    const deletePage = async (page) => {
        setDeletedPage(page);
        await deleteDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', page.id));
        setPages(prevPages => prevPages.filter(p => p.id != page.id));
    }

    /**
     * Make changes to the specific page, where page.field = value.
     * Does not validate value.
     * Does not handle exceptions.
     */
    const updatePage = async (page, field, value) => {
        await updateDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', page.id), {[field]: value});
        setPages(prevPages => prevPages.map(p => {
            if (p.id == page.id) {
                p[field] = value;
            }
            return p;
        }));
    };

    /**
     * Checks if page name is already taken.
     */
    const isUniquePageName = async (name) => {
        const arr = await getDocs(query(
            collection(database, 'Users', auth.currentUser.uid, 'Pages'),
            where('name', '==', name)
        )).then(q => q.docs);
        return arr.length == 0;
    }

    const addBlock = async (heading, color) => {
        if (selectedPageData) {
            const newBlockRef = doc(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks'));
            const newBlock = {
                heading,
                color,
                tasks: [],
                order: blocks.length
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
                            selectedPage={selectedPageData}
                            newPage={newPage}
                            setNewPage={setNewPage}
                            deletedPage={deletedPage}
                            setDeletedPage={setDeletedPage}
                            handleLogout={handleLogout}
                            handlePageSelect={handlePageSelect}
                        />
                        
                        <div className="main-content">

                            {/* Load top utility bar */}
                            <Utilitybar
                                user={userDetails}
                                addPage={addPage}
                                selectedPage={selectedPageData}
                                deletePage={deletePage}
                            />

                            {/* Load selected page info */}
                            {selectedPageData ? (
                                <Page 
                                    blocks={blocks} 
                                    addBlock={addBlock} 
                                    updateBlock={updateBlock} 
                                    deleteBlock={deleteBlock} 
                                    onDragEnd={handleOnDragEnd}
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
                            isUniquePageName={isUniquePageName}
                        />
                    </div>
                </>
            )}
        </div>
        
    );
};

export default Home;

