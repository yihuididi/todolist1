import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wallpaper, { wallpaperList, getImage } from '../wallpaper.jsx';

const mockSelectWallpaper = jest.fn();

describe('wallpaper', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Wallpaper selectWallpaper={mockSelectWallpaper} />
            </MemoryRouter>
        );
    });

    test('renders all wallpapers', () => {
        wallpaperList.forEach(wallpaper => {
            expect(screen.getByTestId(wallpaper)).toBeInTheDocument();
        });
    });

    test('calls selectWallpaper with the correct argument when a wallpaper is clicked', () => {
        fireEvent.click(screen.getByTestId(wallpaperList[0]));
        expect(mockSelectWallpaper).toHaveBeenCalledWith(wallpaperList[0]);
    });

    test('renders the correct image source for each wallpaper', () => {
        wallpaperList.forEach(wallpaper => {
            expect(screen.getByRole('img', {name: wallpaper})).toHaveAttribute('src', getImage(wallpaper));
        })
    });
});