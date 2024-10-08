import React, { useState, useEffect, useRef } from 'react';
import { auth, database } from '../firebase';
import { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, query, where,
    orderBy, startAt, endAt, serverTimestamp, writeBatch } from 'firebase/firestore';
import Sidebar from './sidebar.jsx';
import Utilitybar from './utilitybar.jsx';
import Settings from './settings.jsx';
import Page from './Page.jsx';
import { randomWallpaper, getImage } from './wallpaper.jsx';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Default from './default.jsx';
import anime from 'animejs';
import { toast } from "react-toastify"

const setWallpaper = (page) => {
    const body = document.querySelector('body');
    if (page) {
        body.style.backgroundImage = `url(${getImage(page.wallpaper)})`;
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';
    } else {
        body.style.backgroundImage = `url(${getImage(randomWallpaper())})`;
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';

    }
};

export const Home = () => {
    const [userDetails, setUserDetails] = useState();
    const [pages, setPages] = useState([]);
    const [selectedPageData, setSelectedPageData] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [userExp, setUserExp] = useState(0)
    const [showMysteryBox, setShowMysteryBox] = useState(false);
    

    // To handle animation for sidebar
    const [newPage, setNewPage] = useState(null);
    const [deletedPage, setDeletedPage] = useState(null);

    // To handle page height
    const homeUtilitiesRef = useRef();
    const pageContentRef = useRef();
    const homeDefaultRef = useRef();

    /**
     * Adjust the height of .page-content div.
     */
    const adjustPageHeight = () => {
        if (homeUtilitiesRef.current && pageContentRef.current) {
            pageContentRef.current.style.height = window.innerHeight
                - homeUtilitiesRef.current.clientHeight + 'px';
        }
    };

    const navigate = useNavigate();

    const getUserDetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = doc(database, 'Users', user.uid);
                const userDocs = await getDoc(userRef);
                if (userDocs.exists()) {
                    const xp = Number(userDocs.data().exp)
                    setUserExp(xp)
                    setUserDetails(userDocs.data());
                    const userPages = await getDocs(query(collection(userRef, 'Pages'), orderBy('lastEdited', 'desc')));
                    setPages(userPages.docs.map(page => ({ ...page.data(), id: page.id })));
                    
                } else {
                    console.log('User not found');
                }
            }
        });
    };

    useEffect(() => {
        getUserDetails()
        adjustPageHeight();
        window.addEventListener('resize', adjustPageHeight);

        return () => {
            window.removeEventListener('resize', adjustPageHeight);
        };
    }, []);

    useEffect(() => {
        const fetchBlocks = async () => {
            if (selectedPageData) {
                // order the blocks by its order field
                const blocksSnapshot = await getDocs(query(collection(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks'), orderBy('order')));
                setBlocks(blocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        fetchBlocks();
        adjustPageHeight();
        setWallpaper(selectedPageData);
    }, [selectedPageData]);

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
            icon: 'description',
            createdOn: serverTimestamp(),
            lastEdited: serverTimestamp(),
            wallpaper: randomWallpaper()
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
        setPages(prevPages => prevPages.filter(p => p.id !== page.id));
    }

    /**
     * Make changes to the specific page, where page.field = value.
     * Does not validate value.
     * Does not handle exceptions.
     */
    const updatePage = async (page, field, value) => {
        await updateDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', page.id), {[field]: value});
        setPages(prevPages => prevPages.map(p => {
            if (p.id === page.id) {
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
        return arr.length === 0;
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

    const updateBlock = (blockId, updatedBlock) => {
        if (selectedPageData) {
            const blockRef = doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks', blockId);
            setDoc(blockRef, updatedBlock, { merge: true });
            setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updatedBlock } : block));
        }
    };

    const deleteBlock = async (blockId) => {
        if (selectedPageData) {
            await deleteDoc(doc(database, 'Users', auth.currentUser.uid, 'Pages', selectedPageData.id, 'Blocks', blockId));
            setBlocks(blocks.filter(block => block.id !== blockId));
        }
    };

    const handleTaskCompleted = async (expReward) => { 
        const updatedExp = userExp + Number(expReward);
        if (Math.floor(userExp / 100) < Math.floor(updatedExp / 100)) {
            handleLevelUp();
        }
        await updateDoc(doc(database, 'Users', auth.currentUser.uid), { exp: updatedExp });
        setUserExp(updatedExp)
        setUserDetails((prevDetails) => ({ ...prevDetails, exp: updatedExp }));
    };

    const handleLevelUp = async () => {
        setShowMysteryBox(true);
    };

    const openMysteryBox = async () => {
        const itemsRef = collection(database, 'Items');
        const itemsSnapshot = await getDocs(itemsRef);
        const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const randomItem = items[Math.floor(Math.random() * items.length)];

        const inventoryRef = collection(database, 'Users', auth.currentUser.uid, 'Inventory');
        const inventorySnapshot = await getDocs(inventoryRef);

        const emptySlot = inventorySnapshot.docs.find(doc => !doc.data().item);
        if (emptySlot) {
            await updateDoc(doc(inventoryRef, emptySlot.id), {
                item: true,
                itemRef: doc(itemsRef, randomItem.id),
                level: 1,
            });
            setShowMysteryBox(false); 
            navigate('/home/inventory'); // Navigate to the inventory page
        } else {
            toast.error('Inventory full, please clear your inventory', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setShowMysteryBox(false); 
            navigate('/home/inventory');
        }
    };

    return (
        <>
            {!userDetails || !pages ? (
                <p>Loading...</p>
            ) : (
                <>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

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
                                ref={homeUtilitiesRef}
                                user={userDetails}
                                addPage={addPage}
                                selectedPage={selectedPageData}
                                deletePage={deletePage}
                                userExp={userExp}
                            />

                            {/* Load selected page info */}
                            {selectedPageData ? (
                                <Page 
                                    ref={pageContentRef}
                                    blocks={blocks} 
                                    addBlock={addBlock} 
                                    updateBlock={updateBlock} 
                                    deleteBlock={deleteBlock} 
                                    onDragEnd={handleOnDragEnd}
                                    onTaskCompleted={handleTaskCompleted}
                                />
                            ) : (
                                <Default
                                    addPage={addPage}
                                />
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
                            setWallpaper={setWallpaper}
                        />
                    </div>
                    {showMysteryBox && (
                        <div className="mystery-box-overlay">
                            <div className="mystery-box" onClick={openMysteryBox}>
                                <p>Click to open your mystery box!</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
        
    );
};

export default Home;
