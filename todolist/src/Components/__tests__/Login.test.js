import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login.jsx';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { toast } from 'react-toastify';

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn()
}));

jest.mock('../../firebase', () => ({
    auth: {}
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

describe('Login', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = '12345678';

    beforeEach(() => {
        signInWithEmailAndPassword.mockClear();
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    });

    test('renders Login form', () => {
        expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    test('handles successful login', async () => {
        signInWithEmailAndPassword.mockResolvedValue({});

        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
        });
    });

    test('handles login error', async () => {
        const errorMessage = 'Login failed';
        signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: mockEmail } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
    });
});