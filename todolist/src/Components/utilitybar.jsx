import { Levels } from './levels.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function createNewPage() {
    return {
        key: 'createNewPage',
        html:
            <div className="dropdown-center">
                <div className="util-btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-file-earmark-plus"/>
                </div>
                <ul className="dropdown-menu">
                    <li><Link className="text-decoration-none" to="#">Create new page</Link></li>
                </ul>
            </div>
    };
}

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
                    <li>Urgent Task 1</li>
                    <li>Urgent Task 2</li>
                    <li>Urgent Task 3</li>

                </ul>
            </div>
    };
}

export default function Utilitybar({ user }) {
    function getUtils() {
        return [createNewPage(), alerts(user)];
    }

    // List of utilities
    const [utils, setUtils] = useState(getUtils());

    return (
        <div className="home-utilities">

            {/* Username and EXP bar displayed on left */}
            <div className="user">
                <span className="user-info">{user.username ? user.username : user.email}</span>
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
