import { useEffect, useState } from 'react';
import logo from '../Images/iconbeige.png';
import Icon from '@mui/material/Icon';

export default function Sidebar({user, pages, selectedPage, newPage, setNewPage, deletedPage, setDeletedPage, handleLogout, handlePageSelect}) {
    // Store pages locally
    const [localPages, setLocalPages] = useState(pages);

    useEffect(() => {
        // Handle delete page animation
        if (deletedPage) {
            const dp = document.getElementById(`${deletedPage.id}`);
            if (dp) {
                dp.classList.add('shrinking');
                const timer = setTimeout(() => {
                    setDeletedPage(null);
                    handlePageSelect(null);
                    setLocalPages(pages);
                }, 1000);
                return () => clearTimeout(timer);
            }
        } else {
            setLocalPages(pages);
        }
    }, [pages]);

    function toggleSidebar() {
        document.querySelector('.home-sidebar').classList.toggle('active');
    }

    function openSidebar() {
        document.querySelector('.home-sidebar').classList.add('active');
    }

    // Shows visual indication for user's selected page
    useEffect(() => {
        document.querySelectorAll('.home-sidebar .pagelist .page div').forEach(li => {
            li.style.backgroundColor = 'transparent';
            li.style.color = 'white';
        });

        if (selectedPage) {
            const selected = document.getElementById(`${selectedPage.id}`);
            if (selected) {
                selected.style.backgroundColor = 'white';
                selected.style.color = 'rgba(24, 25, 30, 1)';
            }
        }
    }, [localPages, selectedPage]);

    // Handle new page animation
    useEffect(() => {
        if (newPage) {
            handlePageSelect(newPage);
            const np = document.getElementById(`${newPage.id}`);
            if (np) {
                np.classList.add('growing');
                const timer = setTimeout(() => {
                    np.classList.remove('growing');
                    setNewPage(null);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [localPages]);

    return (
        <div className="home-sidebar" role="navigation">

            {/* Containes todolist icon and sidebar collapse button */}
            <div className="top">
                <img className="app-logo" src={logo} alt="Logo"/>
                <i className="collapse-btn bi bi-list" onClick={toggleSidebar} role="button" aria-label="collapse-btn"/>
            </div>

            <hr/>

            {/* User profile */}
            <div className="dropdown">
                <div className="d-flex flex-row" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle h3" onClick={openSidebar}/>
                    <button className="btn username">{user.email}</button>
                </div>

                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                   <li>
                       <a className="dropdown-item" href="/home/inventory">Inventory</a>
                   </li>

                   <li>
                       <a className="dropdown-item" href="">Inbox</a>
                   </li>

                   <li>
                       <hr className="dropdown-divider"/>
                   </li>

                   <li>
                       <button className="dropdown-item" onClick={handleLogout}>Signout</button>
                   </li>
                </ul>
            </div>

            <hr/>

            {/* List out all of user's pages */}
            <ul className="pagelist">
                {localPages.map(page => (
                    <li key={page.id} className='page' onClick={() => handlePageSelect(page)}>
                        <div id={page.id}>
                            <Icon className="page-icon" onClick={openSidebar}>
                                {page.icon ? page.icon : 'description'}
                            </Icon>
                            <span className="page-name">{page.name}</span>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}
