import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Default from '../default.jsx';

const mockAddPage = jest.fn();

describe('Default', () => {
    beforeEach(() => {
        mockAddPage.mockClear();
        render(
            <MemoryRouter>
                <Default addPage={mockAddPage} />
            </MemoryRouter>
        );
    });

    test('renders the component correctly', () => {
        expect(screen.getByText('Create new page')).toBeInTheDocument();
        expect(screen.getByText('Or select a page to view its contents...')).toBeInTheDocument();
    });

    test('calls addPage when button is clicked', () => {
        fireEvent.click(screen.getByRole('button', {name: 'addPage'}));
        expect(mockAddPage).toHaveBeenCalledTimes(1);
    });
});