// Import wallpapers
import alpha_mountains from '../Static/wallpaper/alpha_mountains.jpg';
import cliff from '../Static/wallpaper/cliff.jpg';
import cloudy from '../Static/wallpaper/cloudy.jpg';
import fantasy_whale from '../Static/wallpaper/fantasy_whale.jpg';
import futuristic_tower from '../Static/wallpaper/futuristic_tower.png';
import gate from '../Static/wallpaper/gate.jpg';
import mountain_sunset from '../Static/wallpaper/mountain_sunset.jpg';
import obelisk from '../Static/wallpaper/obelisk.jpg';
import rural_village from '../Static/wallpaper/rural_village.jpg';
import scifi_city from '../Static/wallpaper/scifi_city.jpg';
import sky_clear from '../Static/wallpaper/sky_clear.jpg';

// Mapping for wallpapers
const wallpaperMap = {
    alpha_mountains: alpha_mountains,
    cliff: cliff,
    cloudy: cloudy,
    fantasy_whale: fantasy_whale,
    futuristic_tower: futuristic_tower,
    gate: gate,
    mountain_sunset: mountain_sunset,
    obelisk: obelisk,
    rural_village: rural_village,
    scifi_city: scifi_city,
    sky_clear: sky_clear
};

// List of wallpapers
export const wallpaperList = [
    'alpha_mountains', 'cliff', 'cloudy', 'fantasy_whale', 'futuristic_tower', 'gate',
    'mountain_sunset', 'obelisk', 'rural_village', 'scifi_city', 'sky_clear'
];

/**
 * Returns a random wallpaper.
 */
export const randomWallpaper = () => {
    return wallpaperList[Math.floor(Math.random() * wallpaperList.length)];
};

/**
 * Returns the image source of wallpaper.
 */
export const getImage = wallpaper => {
    return wallpaperMap[wallpaper];
};

/**
 * Checks if given name is a valid wallpaper.
 */
export const isValidWallpaper = name => {
    return wallpaperList.includes(name);
};

export default function Wallpaper({ selectWallpaper }) {
    return (
        <>
            <div className="d-flex mb-4 align-items-center">
                <h5 className="mb-0">Wallpapers</h5>
            </div>

            <ul className="row row-cols-1 row-cols-md-2 row-cols-xl-3 list-unstyled">
                {wallpaperList.map(wallpaper => (
                    <li key={wallpaper} className="col mb-4">
                        <div
                            className="display mb-2 text-center"
                            onClick={() => selectWallpaper(wallpaper)}
                            data-testid={wallpaper}
                        >
                            <img src={getImage(wallpaper)} aria-label={wallpaper}/>
                            <div className="filter"/>
                        </div>
                        <div className="name text-muted text-center pt-1">{wallpaper}</div>
                    </li>
                ))}
            </ul>
        </>
    );
};
