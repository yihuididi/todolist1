import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Settings, { popUpSettings } from '../settings.jsx';
import { useForm } from 'react-hook-form';
import Icons, { isValidIcon } from '../icons.jsx';
import Wallpaper, { isValidWallpaper } from '../wallpaper.jsx';

const mockPages = [
    { name: 'Page 1', icon: 'icon 1', wallpaper: 'wallpaper 1' },
    { name: 'Page 2', icon: 'icon 2', wallpaper: 'wallpaper 2' },
    { name: 'Page 3', icon: 'icon 3', wallpaper: 'wallpaper 3' }
];

const mockInputs = { name: 'New Page', icon: 'New Icon', wallpaper: 'New Wallpaper' };

const mockUpdatePage = jest.fn();
const mockIsUniquePageName = jest.fn();
const mockSetWallpaper = jest.fn();

jest.mock('react-hook-form', () => ({
    useForm: jest.fn()
}));

jest.mock('../icons.jsx', () => ({
    __esModule: true,
    default: () => <div>Icons Component</div>,
    isValidIcon: jest.fn()
}));

jest.mock('../wallpaper.jsx', () => ({
    __esModule: true,
    default: () => <div>Wallpaper Component</div>,
    isValidWallpaper: jest.fn()
}));

const mockUseForm = {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
    reset: jest.fn(),
    setError: jest.fn(),
    setValue: jest.fn()
};

describe('Settings', () => {
    beforeEach(() => {
        useForm.mockReturnValue(mockUseForm);
        isValidIcon.mockClear();
        isValidWallpaper.mockClear();
        mockUpdatePage.mockClear();
        render(
            <MemoryRouter>
                <Settings
                    pages={mockPages}
                    page={mockPages[0]}
                    updatePage={mockUpdatePage}
                    isUniquePageName={mockIsUniquePageName}
                    setWallpaper={mockSetWallpaper}
                />
            </MemoryRouter>
        );
    });

    test('renders settings form', () => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByLabelText('Page name')).toBeInTheDocument();
        expect(screen.getByLabelText('Page icon')).toBeInTheDocument();
        expect(screen.getByLabelText('Page wallpaper')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
    });

    test('selectDropdown function properly sets selected dropdown to active', () => {
        const dropdownIcons = screen.getByTestId('dropdown-icons');
        expect(dropdownIcons).not.toHaveClass('active');
        fireEvent.click(screen.getAllByRole('button', {name: 'Choose'})[0]);
        expect(dropdownIcons).toHaveClass('active');
    });

    test('selectDropdown function properly sets other dropdown to inactive', () => {
        const chooseBtns = screen.getAllByRole('button', {name: 'Choose'});
        fireEvent.click(chooseBtns[0]);
        fireEvent.click(chooseBtns[1]);
        expect(screen.getByTestId('dropdown-icons')).not.toHaveClass('active');
    });

    test('submit form data correctly when form has no errors', () => {
        mockUseForm.handleSubmit.mockImplementation((cb) => () => cb(mockInputs));
        mockIsUniquePageName.mockResolvedValue(true);
        isValidIcon.mockResolvedValue(true);
        isValidWallpaper.mockResolvedValue(true);

        fireEvent.submit(screen.getByRole('button', { name: /save/i }));

        waitFor(() => {
            expect(mockUpdatePage).toHaveBeenCalledWith(mockPages[0], 'name', mockInputs.name);
        });
        waitFor(() => {
            expect(mockUpdatePage).toHaveBeenCalledWith(mockPages[0], 'icon', mockInputs.icon);
        });
        waitFor(() => {
            expect(mockUpdatePage).toHaveBeenCalledWith(mockPages[0], 'wallpaper', mockInputs.wallpaper);
        });
    });

    test('setError when form has errors', () => {
        mockUseForm.handleSubmit.mockImplementation((cb) => () => cb(mockInputs));
        mockIsUniquePageName.mockResolvedValue(true);
        isValidIcon.mockResolvedValue(false);
        isValidWallpaper.mockResolvedValue(true);

        fireEvent.submit(screen.getByRole('button', { name: /save/i }));

        waitFor(() => {
            expect(mockUseForm.setError).toHaveBeenCalledWith('icon', { type: 'server', message: 'Icon does not exists' });
        });
    });

    test('onSubmit only updates page fields that has changed', () => {
        const differentMockInput = { name: mockPages[0].name, icon: 'New Icon', wallpaper: 'New Wallpaper' };
        mockUseForm.handleSubmit.mockImplementation((cb) => () => cb(differentMockInput));
        isValidIcon.mockResolvedValue(true);
        isValidWallpaper.mockResolvedValue(true);

        fireEvent.submit(screen.getByRole('button', { name: /save/i }));

        waitFor(() => {
            expect(mockUpdatePage).toHaveBeenCalledTimes(2);
        });
    })
});