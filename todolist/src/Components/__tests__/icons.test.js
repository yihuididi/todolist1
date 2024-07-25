import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Icons, { isValidIcon } from '../icons.jsx';
import iconNames from '../../Static/iconNames.js';

const mockPage = { name: 'Page', icon: 'icon1', wallpaper: 'wallpaper' }
const mockSelectIcon = jest.fn();

jest.mock('../../Static/iconNames.js', () => [
    "3d_rotation",
    "ac_unit",
    "access_alarm",
    "access_alarms",
    "access_time",
]);

describe('icons', () => {
    let renderObject;

    beforeEach(() => {
        renderObject = render(
            <MemoryRouter>
                <Icons selectIcon={mockSelectIcon} page={mockPage} />
            </MemoryRouter>
        );
    })

    test('renders Icon component', () => {
        expect(screen.getByText('Icons')).toBeInTheDocument();
        expect(screen.getByLabelText('Search for icons')).toBeInTheDocument();
    });

    test('renders all icons initially', () => {
        iconNames.forEach(icon => {
            expect(screen.getByTestId(icon)).toBeInTheDocument();
        });
    });

    test('filters icons based on search input', () => {
        const filter = screen.getByLabelText('Search for icons');
        fireEvent.change(filter, { target: { value: 'access' } });
        
        expect(screen.getByTestId(iconNames[2]));
        expect(screen.queryByTestId(iconNames[0])).not.toBeInTheDocument();
    });

    test('calls selectIcon function when an icon is clicked', () => {
        fireEvent.click(screen.getByTestId(iconNames[0]));
        expect(mockSelectIcon).toHaveBeenCalledWith(iconNames[0]);
    });

    test('resets search input when page changes', () => {
        const filter = screen.getByLabelText('Search for icons');
        fireEvent.change(filter, { target: { value: 'foo' } });
        
        renderObject.rerender(
            <MemoryRouter>
                <Icons selectIcon={mockSelectIcon} page={null} />
            </MemoryRouter>
        );

        waitFor(() => expect(filter.value).toBe(''));
    });

    test('isValidIcon function works correctly', () => {
        expect(isValidIcon(iconNames[0])).toBe(true);
        expect(isValidIcon('bar')).toBe(false);
    });
});