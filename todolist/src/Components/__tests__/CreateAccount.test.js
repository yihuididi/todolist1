import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateAccount from '../CreateAccount.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, database } from '../../firebase';
import { mocked } from 'ts-jest/utils';

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn()
}));

jest.mock('firebase/auth', () => ({
    setDoc: jest.fn(),
    doc: jest.fn(() => 'mockDoc')
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
        render(
            <MemoryRouter>
                <CreateAccount />
            </MemoryRouter>
        );
    });

    test('renders CreateAccount component', () => {
        expect(screen.getByRole('button', {name: 'Create Account'})).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByText('Already Registered?')).toBeInTheDocument();
    });

    test('handles successful account creation', async () => {
        console.log(createUserWithEmailAndPassword);
        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: {
                uid: mockUid,
                email: mockEmail
            }
        });

        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', {name: 'Create Account'}));

        await screen.findByText('Account Created!');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth.currentUser, mockEmail, mockPassword);
        expect(setDoc).toHaveBeenCalledWith('mockDoc', {
            email: mockEmail,
            exp: 0
        });
        expect(toast.success).toHaveBeenCalledWith('Account Created!');
    });
});