import React from 'react';
import DishForm from '../components/DishForm';
import DishList from '../components/DishList';


const Dish = () => {
    return ( 
        <div className="flex">

            <div className="border-r p-4">
                <DishList />
            </div>
            <div className="p-4">
                <DishForm />
            </div>
    
        </div>
     );
}
 
export default Dish;