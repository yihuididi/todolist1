import { render, screen, fireEvent } from '@testing-library/react';
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

    test('toggles sidebar on collapse button click', () => {
        fireEvent.click(screen.getByRole('button', { name: /collapse-btn/i }));
        expect(screen.getByRole('navigation')).toHaveClass('active');
    });

    test('handles page selection', () => {
        fireEvent.click(screen.getByText(mockPages[0].name));
        expect(mockHandlePageSelect).toHaveBeenCalledWith(mockPages[0]);
    });

    test('handles logout', () => {
        fireEvent.click(screen.getByText('Signout'));
        expect(mockHandleLogout).toHaveBeenCalled();
    });

    test('renders inventory link with correct href', () => {
        const inventory = screen.getByText('Inventory');
        expect(inventory).toBeInTheDocument();
        expect(inventory).toHaveAttribute('href', '/home/inventory');
    });
});