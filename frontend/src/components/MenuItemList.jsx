import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const MenuItemList = () => {

    const [menuItems, setMenuItems] = useState([]);

    const fetchMenuItems = async () => {
        try {
            const res = await fetch('/api/menu');
            const data = res.json();
            setMenuItems(data);
        } catch (e) {
            console.log('Error fetching menu items: ', e);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleDelete = async (menuItemId) => {
        try {
            await fetch(`/api/menu/${menuItemId}`, {method: 'DELETE'});
            const newItems = menuItems.filter(item => item!=menuItemId);
            setMenuItems(newItems);
        } catch (e) {
            console.error('Error deleting menu item:', error);
        }
    }

    return ( 
        <div>
            <h2 className="text-xl font-bold mb-4">Current Menu of the Week</h2>
            <ul className='space-y-2'> 
                {
                    menuItems.map((item) => {
                        return (
                            <li key={item.menu_item_id} className='border p-3 rounded'>
                                <p>Dish: {item.dish?.dish_name || 'Unknown dish'}</p>
                                <p>Day: {item.day_of_week}</p>
                                <p>Label: {item.label}</p>
                                <p>Quantity: {item.quantity}</p>
                                <Button variant="destructive" onClick={() => handleDelete(item.menu_item_id)}>Delete</Button>

                            </li>
                        )
                    })

                }
            
            
            </ul>
        </div>
     );
}
 
export default MenuItemList;