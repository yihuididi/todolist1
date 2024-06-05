import logo from '../Images/iconbeige.png';

export function renderSidebar(user, pages, handleLogout) {
    function toggleSidebar() {
        document.querySelector('.home-sidebar').classList.toggle('active');
    }

    function openSidebar() {
        document.querySelector('.home-sidebar').classList.add('active');
    }

    return (
        <div className="home-sidebar">

            {/* Containes todolist icon and sidebar collapse button */}
            <div className="top">
                <img className="app-logo" src={logo} alt="Logo"/>
                <i className="collapse-btn bi bi-list" onClick={toggleSidebar}/>
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
                       <a className="dropdown-item" href="">New Page</a>
                   </li>

                   <li>
                       <a className="dropdown-item" href="">Settings</a>
                   </li>

                   <li>
                       <a className="dropdown-item" href="">Profile</a>
                   </li>

                   <li>
                       <hr className="dropdown-divider"/>
                   </li>

                   <li>
                       <div className="dropdown-item" onClick={handleLogout}>Signout</div>
                   </li>
                </ul>
            </div>

            <hr/>

            {/* List out all of user's pages */}
            <ul>
                {pages.map(page => (
                    <li key={page.id} className="page">
                        <div>
                            <i className="page-icon bi bi-file-earmark" onClick={openSidebar}/>
                            <span>{page.name}</span>
                        </div>
                        <span className="label">{page.name}</span>
                    </li>
                ))}
            </ul>

        </div>
    );
}
