import React from 'react';
import MenuItemList from '../components/MenuItemList';
import MenuItemForm from '../components/MenuItemForm';

const Menu = () => {
    return (
        <div className='flex'>
            <div className="w-1/2 border-r p-4">
                <MenuItemList />
            </div>
            <div className="w-1/2 p-4">
                <MenuItemForm />
            </div>
            
        </div>
    )
}

export default Menu;