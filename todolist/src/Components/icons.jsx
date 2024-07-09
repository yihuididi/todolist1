import Icon from '@mui/material/Icon';
import iconNames from '../Static/iconNames.js';
import { useState, useEffect } from 'react';

export function isValidIcon(icon) {
    return iconNames.includes(icon);
}

export default function Icons({ selectIcon, page }) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        setSearch('');
    }, [page]);

    return (
        <>
            <div className="d-flex mb-4 align-items-center">
                <h5 className="mb-0">Icons</h5>
                <div className="d-flex flex-nowrap ms-auto">
                    <label htmlFor="settings-page-search-icon" className="visually-hidden">
                        Search for icons
                    </label>
                    <input className="form-control mb-0" id="settings-page-search-icon" type="search"
                        placeholder="Filter" autoComplete="off" onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ul className="row row-cols-3 row-cols-lg-4 list-unstyled">
                {iconNames.filter(name => search === '' ? true : name.includes(search))
                    .map(icon => (
                        <li key={icon} className="col mb-4">
                            <div
                                className="display px-3 py-4 mb-2 bg-body-secondary text-center rounded"
                                onClick={() => selectIcon(icon)}
                                onMouseOver={e => e.target.style.color = "#1976d2"}
                                onMouseOut={e => e.target.style.color = "inherit"}
                            >
                                <Icon>{icon}</Icon>
                            </div>
                            <div className="name text-muted text-center pt-1">{icon}</div>
                        </li>
                    ))
                }
            </ul>
        </>
    );
}
