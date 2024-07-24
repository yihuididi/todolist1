import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../sidebar.jsx';

const mockEmail = 'test@example.com';

const mockPages = [
    { id: 1, name: 'Page 1', icon: 'home' },
    { id: 2, name: 'Page 2', icon: 'star' }
];

const mockUser = {
    email: mockEmail
}

const mockSetNewPage = jest.fn();
const mockSetDeletedPage = jest.fn();
const mockHandleLogout = jest.fn();
const mockHandlePageSelect = jest.fn();

describe('sidebar', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Sidebar
                    user={mockUser}
                    pages={mockPages}
                    selectedPage={null}
                    newPage={null}
                    setNewPage={mockSetNewPage}
                    deletedPage={null}
                    setDeletedPage={mockSetDeletedPage}
                    handleLogout={mockHandleLogout}
                    handlePageSelect={mockHandlePageSelect}
                />
            </MemoryRouter>
        );
    });

    test('renders the sidebar with user and pages', () => {
        expect(screen.getByText(mockEmail)).toBeInTheDocument();
        mockPages.forEach(page => expect(screen.getByText(page.name)).toBeInTheDocument());
    });
});