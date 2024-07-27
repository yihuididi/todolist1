import './Inventory.css';
import { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { collection, doc, getDocs, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import itemMap from '../Static/items.js';
import stone from '../Static/inventory-page/stone.png';
import arrow from '../Static/inventory-page/arrow.png';

export const Inventory = ({ user }) => {
    const [loading, setLoading] = useState(true);

    // Data of players inventory
    const [inventory, setInventory] = useState([]);

    // Get inventory data of users.
    // If user has not Inventory collection (i.e. a new user), create the collection for the user.
    const getInventory = async () => {
        const inventoryRef = collection(database, 'Users', user.uid, 'Inventory');
        const data = await getDocs(inventoryRef);
        if (data.docs.length > 0) {
            const arr = await Promise.all(data.docs.map(async doc => {
                let slot = { ...doc.data(), id: doc.id };
                if (slot.item) {
                    await getDoc(slot.itemRef).then(snap => {
                        slot = { ...slot, ...snap.data() }
                    });
                }
                return slot;
            }));
            setInventory(arr);
            setLoading(false);
        } else {
            for (let i = 0; i < 30; i++) {
                await addDoc(inventoryRef, {
                    item: false
                });
            }
            getInventory();
        }
    };

    useEffect(() => {
        if (user) {
            getInventory();
        }
        document.addEventListener('dragstart', dragstartHandler);
        document.addEventListener('dragover', dragoverHandler);
        document.addEventListener('drop', dropHandler);

        return () => {
            document.removeEventListener('dragstart', dragstartHandler);
            document.removeEventListener('dragover', dragoverHandler);
            document.removeEventListener('drop', dropHandler);
        };
    }, [user]);

    // The item getting dragged
    let draggedItem = null;

    // The items getting swapped
    const [swappedItems, setSwappedItems] = useState({
        x: null,
        y: null
    });

    const dragstartHandler = (event) => {
        if (event.target.classList.contains('inventory-item')) {
            draggedItem = event.target;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', event.target.innerHTML);
        }
    };

    const dragoverHandler = (event) => {
        if (event.target.classList.contains('inventory-slot') ||
            event.target.classList.contains('inventory-item')) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        }
    };

    const dropHandler = (event) => {
        event.preventDefault();
        if (event.target.classList.contains('inventory-slot')) {
            if (draggedItem) {
                if (event.target !== draggedItem.parentNode) {
                    setSwappedItems({
                        x: event.target.getAttribute('data-id'),
                        y: draggedItem.parentNode.getAttribute('data-id')
                    });
                    event.target.appendChild(draggedItem);
                }
            }
        } else if (event.target.classList.contains('inventory-item')) {
            const targetSlot = event.target.parentNode;
            const sourceSlot = draggedItem.parentNode;
            if (draggedItem && targetSlot !== sourceSlot) {
                targetSlot.appendChild(draggedItem);
                sourceSlot.appendChild(event.target);
                setSwappedItems({
                    x: targetSlot.getAttribute('data-id'),
                    y: sourceSlot.getAttribute('data-id')
                });
            }
        }
        draggedItem = null;
    };

    useEffect(() => {
        const swap = async (x, y) => {
            if (user && x && y) {
                setLoading(true);
                const inventoryRef = collection(database, 'Users', user.uid, 'Inventory');
                const xData = await getDoc(doc(inventoryRef, x));
                const yData = await getDoc(doc(inventoryRef, y));
                await updateDoc(doc(inventoryRef, x), { ...yData.data() });
                await updateDoc(doc(inventoryRef, y), { ...xData.data() });
                setLoading(false);
            }
        };
        swap(swappedItems.x, swappedItems.y);
    }, [swappedItems.x, swappedItems.y]);

    return (
        <>
            {loading ? document.body.style.setProperty('cursor', 'wait') : document.body.style.setProperty('cursor', 'auto')}
            <link href="https://fonts.googleapis.com/css?family=Tangerine" rel="stylesheet" type="text/css"/>
            <div className="inventory-page">
                <div className="top-bar">
                    <a className="back-btn" href="/home">
                        <img className="arrow" src={arrow} />
                        <img className="stone" src={stone} />
                    </a>
                </div>

                <div className="dashboard">
                    <div className="cursive">Inventory</div>
                    <div className="contain">
                        <div className="inventory">
                            {inventory.map(slot => (
                                <div key={slot.id} data-id={slot.id} className="inventory-slot" data-testid={slot.id}>
                                    {slot.item ? (
                                        <img className="inventory-item" src={itemMap[slot.name]} draggable="true" data-testid="inventory-item"/>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        <div className="equip">
                        </div>
                    </div> 
                </div>
            </div>
        </>
    );
};

export default Inventory;
