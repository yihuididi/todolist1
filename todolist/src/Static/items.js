// Import images here sorted in increasing 'tileXXX' order.
// This is so that we know what icons has been used for each equipment.
import swordOfDurand from './items/equipment/tile000.png';
import zandersBow from './items/equipment/tile004.png';
import battlestaff from './items/equipment/tile005.png';
import ilmorladeensBattleaxe from './items/equipment/tile007.png';

// Mapping with item name as keys and icons as values.
// Item name should match exactly as the name of item in firestore.
// Sort in the order as it was imported.
export const itemMap = {
    "Sword of Durand": swordOfDurand,
    "Zander's Bow": zandersBow,
    "Battlestaff": battlestaff,
    "Ilmorladeen's Battleaxe": ilmorladeensBattleaxe,
};

export default itemMap;
