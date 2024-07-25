import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Utilitybar from '../utilitybar.jsx';
import { popUpSettings } from '../settings.jsx';

const mockUsername = 'testuser';
const mockEmail = 'test@example.com';

const mockUser = {
    exp: 250,
    username: mockUsername,
    email: mockEmail
};

const mockSelectedPage = {
    name: 'Page 1',
};

const mockAddPage = jest.fn();
const mockDeletePage = jest.fn();

jest.mock('../settings.jsx', () => ({
    popUpSettings: jest.fn()
}));

describe('utilitybar with selected page', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Utilitybar
                    user={mockUser}
                    addPage={mockAddPage}
                    selectedPage={mockSelectedPage}
                    deletePage={mockDeletePage}
                />
            </MemoryRouter>
        );
    });

    test('renders all utilities', () => {
        expect(screen.getByRole('button', { name: /createnewpage/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /alerts/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /deletepage/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /pagesettings/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /createblock/i })).toBeInTheDocument();
    });

    test('calls deletePage with selectedPage when delete page is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /delpage/i }));
        expect(mockDeletePage).toHaveBeenCalledWith(mockSelectedPage);
    });

    test('calls popUpSettings when settings icon is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /popupsettings/i }));
        expect(popUpSettings).toHaveBeenCalled();
    });
});

describe('utilitybar with no selected page', () => {
    let renderObject;

    beforeEach(() => {
        renderObject = render(
            <MemoryRouter>
                <Utilitybar
                    user={mockUser}
                    addPage={mockAddPage}
                    selectedPage={null}
                    deletePage={mockDeletePage}
                />
            </MemoryRouter>
        );
    });

    test('renders non page-specific utilities', () => {
        expect(screen.getByRole('button', { name: /createnewpage/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /alerts/i })).toBeInTheDocument();
    });

    test('renders username and exp bar', () => {
        if (mockUser.username) {
            expect(screen.getByText(mockUsername)).toBeInTheDocument();
        } else {
            expect(screen.getByText(mockEmail)).toBeInTheDocument();
        }
        expect(screen.getByText('Lvl')).toBeInTheDocument();
    })

    test('test if correct level is displayed', () => {
        expect(screen.getByText(Math.floor(mockUser.exp / 100).toString())).toBeInTheDocument();
        expect(screen.getByTestId('exp-bar')).toHaveAttribute('data-exp', (mockUser.exp % 100).toString());
    });

    test('calls addPage when create new page is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /addpage/i }));
        expect(mockAddPage).toHaveBeenCalled();
    });

    test('checks if utilities are present when component is rerendered with selected page', () => {
        expect(screen.queryByRole('button', { name: /deletepage/i })).not.toBeInTheDocument();
        renderObject.rerender(
            <MemoryRouter>
                <Utilitybar
                    user={mockUser}
                    addPage={mockAddPage}
                    selectedPage={mockSelectedPage}
                    deletePage={mockDeletePage}
                />
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: /deletepage/i })).toBeInTheDocument();
    });
});

test('toggles form visibility when create block button is clicked', () => {
    document.body.innerHTML = '<div class="home"><div class="page-content"><div class="add-block-form"></div></div></div>';
    render(
        <MemoryRouter>
            <Utilitybar
                user={mockUser}
                addPage={mockAddPage}
                selectedPage={mockSelectedPage}
                deletePage={mockDeletePage}
            />
        </MemoryRouter>
    );

    const form = document.querySelector('.home .page-content .add-block-form');
    expect(form).not.toHaveClass('active');
    fireEvent.click(screen.getByRole('button', { name: /shownewblockform/i }));
    expect(form).toHaveClass('active');
});