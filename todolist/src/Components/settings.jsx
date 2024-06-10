import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Enable users to view the settings page when they click on settings icon.
 */
export function popUpSettings() {
    document.querySelector('.home').classList.toggle('blur');
    document.querySelector('.settings-popup').classList.toggle('active');
}

/**
 * Contains the html for the settings page, as well as form validation for updating page.
 */
export default function Settings({ pages, page, updatePage }) {

    // Not yet completed
    // Client and server side validation using zod
    const updatePageSchema = z.object({
        // Page name cannot exceed 50 characters
        name: z.string().max(50, 'Name must be shorter than 50 characters'),

        // Other form fields goes here
        icon: z.string()

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
        getValues
    } = useForm();

    /**
     * Updates firestore with submitted data.
     */
    const onSubmit = async (data) => {
        if (data.name != '') {
            await updatePage(page, 'name', data.name);
        }
        reset();
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
                    <form onSubmit={handleSubmit(onSubmit)} className="align-items-center row mb-3">

                        <label htmlFor="settings-page-name" className="col-sm-3 col-form-label">Page name</label>
                        <div className="col-sm-9">
                            <input id="settings-page-name" type="text" className="form-control" autoComplete="name" placeholder={page.name}
                                {...register("name", {
                                    maxLength: {
                                        value: 50,
                                        message: "Name must be shorter than 50 characters"
                                    },
                                    validate: value =>
                                        !pages.map(p => p.name).includes(value) || "Page name already exists"
                                })}
                            />
                            {errors.name && (
                                <div className="alert alert-danger" role="alert">
                                    {`${errors.name.message}`}
                                </div>
                            )}
                        </div>

                        <label htmlFor="settings-page-icon" className="col-sm-3 col-form-label">Page icon</label>
                        <div className="col-sm-9">
                            <input id="settings-page-icon" type="text" disabled className="form-control" placeholder="Coming soon"
                                {...register("icon")}
                            />
                        </div>

                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary"
                                disabled={isSubmitting}>
                                Save
                            </button>
                            <button className="btn btn-secondary" onClick={popUpSettings}>Close</button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}
