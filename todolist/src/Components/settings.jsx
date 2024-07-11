import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Icons, { isValidIcon } from './icons.jsx';
import Wallpaper, { isValidWallpaper } from './wallpaper.jsx';
import Icon from '@mui/material/Icon';

export function popUpSettings() {
    document.querySelector('.home').classList.toggle('blur');
    document.querySelector('.settings-popup').classList.toggle('active');
}

export default function Settings({ pages, page, updatePage, isUniquePageName, setWallpaper }) {

    // References for form elements
    const chooseIcon = useRef();
    const dropdownIcon = useRef();
    const chooseWallpaper = useRef();
    const dropdownWallpaper = useRef();

    /**
     * Toggle the selected dropdown to active.
     */
    const selectDropdown = dropdown => {
        if (dropdown === 'icon') {
            chooseWallpaper.current.classList.remove('active');
            dropdownWallpaper.current.classList.remove('active');
            chooseIcon.current.classList.toggle('active');
            dropdownIcon.current.classList.toggle('active');
        }

        if (dropdown === 'wallpaper') {
            chooseIcon.current.classList.remove('active');
            dropdownIcon.current.classList.remove('active');
            chooseWallpaper.current.classList.toggle('active');
            dropdownWallpaper.current.classList.toggle('active');
        }
    };

    // States representing the values in input fields
    const [pageIcon, setPageIcon] = useState('');
    const [pageWallpaper, setPageWallpaper] = useState('');

    useEffect(() => {
        reset();
        if (page) {
            setPageIcon(page.icon);
            setPageWallpaper(page.wallpaper);
        }
    }, [page]);

    // Client side form validation using zod
    const updatePageSchema = z.object({
        // Page name cannot exceed 50 characters
        name: z.string().max(50, 'Name must be shorter than 50 characters'),
        icon: z.string(),
        wallpaper: z.string()

    // Checks if given name already exists
    }).refine(data => !pages.map(p => p.name).includes(data.name), {
        message: 'Page name already exists',
        path: ['name']
    });

    // React hook forms utils
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
        setError,
        setValue
    } = useForm({
        resolver: zodResolver(updatePageSchema)
    });

    const selectIcon = (icon) => {
        setPageIcon(icon);
        setValue('icon', icon);
    };

    const selectWallpaper = (wallpaper) => {
        setPageWallpaper(wallpaper);
        setValue('wallpaper', wallpaper);
    };

    /**
     * Updates firestore with submitted data.
     * Does server side validation.
     */
    const onSubmit = async (data) => {
        if (data.name !== '') {
            if (await isUniquePageName(data.name)) {
                try {
                    await updatePage(page, 'name', data.name);
                    reset();
                } catch (err) {
                    setError('root', {
                        type: 'server',
                        message: err.message
                    });
                }
            } else {
                setError('name', {
                    type: 'server',
                    message: 'Page name already exists'
                });
            }
        }

        if (data.icon !== page.icon) {
            if (isValidIcon(data.icon)) {
                try {
                    await updatePage(page, 'icon', data.icon);
                    reset();
                } catch (err) {
                    setError('root', {
                        type: 'server',
                        message: err.message
                    });
                }
            } else {
                setError('icon', {
                    type: 'server',
                    message: 'Icon does not exists'
                });
            }
        }

        if (data.wallpaper != page.wallpaper) {
            if (isValidWallpaper(data.wallpaper)) {
                try {
                    await updatePage(page, 'wallpaper', data.wallpaper);
                    setWallpaper(page);
                    reset();
                } catch (err) {
                    setError('root', {
                        type: 'server',
                        message: err.message
                    });
                }
            } else {
                setError('wallpaper', {
                    type: 'server',
                    message: 'Wallpaper does not exists'
                });
            }
        }
    };

    return (
        <>
            {!page ? (
                <>
                    <h4>Something went wrong.</h4>
                    <p>Error: no page was selected.</p>
                    <button onClick={popUpSettings}>Close</button>
                </>
            ) : (
                <>
                    {/* Header of settings page */}
                    <div className="header">
                        <h5>Settings</h5>
                        <p className="page-name">{page.name}</p>
                        <hr/>
                    </div>

                    {/* Form for updating page settings */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Input for changing page name */}
                        <div className="align-items-center row mb-3">
                            <label htmlFor="settings-page-name" className="col-sm-3 col-form-label">Page name</label>
                            <div className="col-sm-9">
                                <input id="settings-page-name" type="text" className="form-control"
                                    autoComplete="off" placeholder={page.name} {...register("name")} 
                                />
                                {errors.name && (
                                    <div className="alert alert-danger" role="alert">
                                        {`${errors.name.message}`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input for changing page icon */}
                        <div className="page-icon align-items-center row mb-3">
                            <label htmlFor="settings-page-icon" className="col-sm-3 col-form-label">Page icon</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <div className="input-group-text">
                                        <Icon style={{ fontSize: 18 }}>{pageIcon}</Icon>
                                    </div>
                                    <input type="text" id="settings-page-icon" className="disabled form-control"
                                        autoComplete="off" value={pageIcon} readOnly {...register("icon")}
                                    />
                                    <button ref={chooseIcon} type="button" onClick={() => selectDropdown('icon')}
                                        className="choose btn btn-outline-secondary">
                                        Choose
                                    </button>
                                </div>
                                {errors.icon && (
                                    <div className="alert alert-danger" role="alert">
                                        {`${errors.icon.message}`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dropdown for selecting new page icon */}
                        <div ref={dropdownIcon} className="settings-dropdown container">
                            <Icons selectIcon={selectIcon} page={page} />
                        </div>

                        {/* Input for changing page wallpaper */}
                        <div className="page-wallpaper align-items-center row mb-3">
                            <label htmlFor="settings-page-wallpaper" className="col-sm-3 col-form-label">Page wallpaper</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <input type="text" id="settings-page-wallpaper" className="disabled form-control"
                                        autoComplete="off" value={pageWallpaper} readOnly {...register("wallpaper")}
                                    />
                                    <button ref={chooseWallpaper} type="button" onClick={() => selectDropdown('wallpaper')}
                                        className="choose btn btn-outline-secondary">
                                        Choose
                                    </button>
                                </div>
                                {errors.icon && (
                                    <div className="alert alert-danger" role="alert">
                                        {`${errors.wallpaper.message}`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dropdown for selecting new page wallpaper */}
                        <div ref={dropdownWallpaper} className="settings-dropdown container">
                            <Wallpaper selectWallpaper={selectWallpaper} />
                        </div>

                        {/* Buttons for saving or closing settings form */}
                        <div className="btm col-auto">
                            <button type="submit" className="btn btn-primary"
                                disabled={isSubmitting}>
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={popUpSettings}>Close</button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}
