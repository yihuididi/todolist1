import { Levels } from './levels.jsx';
import { useState, useEffect } from 'react';
import { popUpSettings } from './settings.jsx';
import { ProgressBar } from 'react-bootstrap';

function showNewBlockForm() {
    const form = document.querySelector('.home .page-content .add-block-form');
    if (form) {
        form.classList.toggle('active');
    }
}

export default function Utilitybar({ user, addPage, selectedPage, deletePage }) {
    // List of utilites
    const [utils, setUtils] = useState([]);

    /**
     * Creates html for creating a new page.
     */
    function createNewPage() {
        return {
            key: 'createNewPage',
            html:
                <div className="dropdown-center">
                    <div className="util-btn" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-file-earmark-plus"/>
                    </div>
                    <ul className="dropdown-menu">
                        <li onClick={addPage}>Create new page</li>
                    </ul>
                </div>
        };
    }

    /**
     * Creates html for showing list of user's tasks whose dateline is approaching.
     */
    function alerts(user) {
        return {
            key: 'alerts',
            html:
                <div className="dropdown-center">
                    <div className="util-btn" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-exclamation-triangle"/>
                    </div>
                    <ul className="dropdown-menu">

                        {/* Function to be implemented
                        {getUrgentTask(user).map(task => (
                            <li key={task.id}>
                                {task.description}
                            </li>
                        ))}
                        */}

                        {/* Temporary code */}
                        <li>To be implemented...</li>

                    </ul>
                </div>
        };
    }

    /**
     * Creates html for deleting selected page from firestore.
     */
    function deleteSelectedPage(selectedPage) {
        return {
            key: 'deletePage',
            html:
                <div className="dropdown-center">
                    <div className="util-btn" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-trash"/>
                    </div>
                    <ul className="dropdown-menu">
                        <li onClick={() => deletePage(selectedPage)}>Delete page</li>
                    </ul>
                </div>
        };
    }

    /**
     * Creates html for changing settings of current page.
     */
    function pageSettings() {
        return {
            key: 'pageSettings',
            html:
                <div className="settings">
                    <div className="util-btn" onClick={popUpSettings}>
                        <i className="bi bi-gear"/>
                    </div>
                </div>
        }
    }

    /**
     * Creates html for creating new block.
     */
    function createBlock() {
        return {
            key: 'createBlock',
            html:
                <div className="create-block">
                    <div className="util-btn" onClick={showNewBlockForm}>
                        <i className="bi bi-plus-circle"/>
                    </div>
                </div>
        }
    }

    /**
     * Fill up utils array based on what page the user selected.
     */
    function getUtils() {
        const utils = [createNewPage(), alerts(user)];
        if (selectedPage) {
            utils.push(deleteSelectedPage(selectedPage));
            utils.push(pageSettings());
            utils.push(createBlock());
        }
        setUtils(utils);
        return utils;
    }

    // Call getUtils() whenever selectedPage changes
    useEffect(() => {
        setUtils(getUtils);
    }, [selectedPage]);

    return (
        <div className="home-utilities">

            {/* Username and EXP bar displayed on left */}
            <div className="user">
                <span className="user-info">{user.username ? user.username : user.email}</span>
                <ProgressBar now={(user.exp / 1000) * 100} label={`${user.exp} XP`} />
                <Levels className="user-info" user={user} />
            </div>

            {/* List out utilities as icons on right */}
            <div className="utilities">
                <ul>
                    {utils?.map(util => (
                        <li key={util.key}>{util.html}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
