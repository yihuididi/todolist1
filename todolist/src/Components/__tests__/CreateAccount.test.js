import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateAccount from '../CreateAccount.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, database } from '../../firebase';

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
    setDoc: jest.fn(),
    doc: jest.fn()
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock('../../firebase', () => ({
    auth: {
        currentUser: {
            uid: '12345',
            email: 'test@example.com'
        }
    },
    database: {}
}));

describe('CreateAccount', () => {
    const mockUid = '12345';
    const mockEmail = 'test@example.com';
    const mockPassword = '12345678';

    beforeEach(() => {
        createUserWithEmailAndPassword.mockClear();
        render(
            <MemoryRouter>
                <CreateAccount />
            </MemoryRouter>
        );
    });

    test('renders CreateAccount form', () => {
        expect(screen.getByRole('button', {name: 'Create Account'})).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByText('Already Registered?')).toBeInTheDocument();
    });

    test('handles successful account creation', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: mockUid,
                email: mockEmail
            }
        });

        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', {name: 'Create Account'}));

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
        });
        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(doc(database, 'Users', mockUid), {
                email: mockEmail,
                exp: 0
            });
        });
        expect(toast.success).toHaveBeenCalledWith('Account Created!');
    });

    test('handles account creation error', async () => {
        const errorMessage = 'Error creating account';
        createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', {name: 'Create Account'}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
    });
});