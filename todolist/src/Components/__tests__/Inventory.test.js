import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import Inventory from '../Inventory.jsx';
import { collection, doc, getDocs, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { auth, database } from '../../firebase';
import itemMap from '../../Static/items';

const mockUser = { uid: 1, username: 'username', email: 'test@example.com' };

const mockInventory = [
    { id: '1', item: true, itemRef: 'ref1', name: 'item1' },
    { id: '2', item: false },
    { id: '3', item: true, itemRef: 'ref3', name: 'item3' },
];

const mockItemData = {
    item1: { name: 'sword', description: 'sword' },
    item2: { name: 'staff', description: 'staff' }
};

jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    addDoc: jest.fn()
}));

describe('Inventory', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        collection.mockReturnValue('inventoryRef');
        getDocs.mockResolvedValue({
            docs: mockInventory.map(slot => ({
                id: slot.id,
                data: () => slot
            }))
        });
        getDoc.mockImplementation(ref => {
            return Promise.resolve({ data: () => mockItemData[ref.id] });
        });
        updateDoc.mockResolvedValue({});
        await act(() => {
          render(
              <MemoryRouter>
                  <Inventory user={mockUser} />
              </MemoryRouter>
          );
        });
    })

    test('renders inventory component', () => {
        expect(screen.getByText('Inventory')).toBeInTheDocument();
        mockInventory.forEach(slot => waitFor(() => (expect(screen.getByTestId(slot.id)).toBeInTheDocument())));
    });

    /*
    test('checks if drag and drop has swapped items in backend', () => {
        waitFor(() => {
            const inventoryItems = screen.getAllByTestId('inventory-item');
            fireEvent.dragStart(inventoryItems[0]);
            fireEvent.dragOver(screen.getByTestId('2'));
            fireEvent.drop(screen.getByTestId('2'));
        });
        
        waitFor(() => {
            expect(updateDoc).toHaveBeenCalledTimes(2);
            expect(updateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(mockInventory[0]));
            expect(updateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(mockInventory[1]));
        });
    });
    */
});
