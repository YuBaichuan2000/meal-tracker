import React from 'react';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';



const Ingredient = () => {
    return ( 
        <div className='flex'>
            <div className="border-r p-4">
                <IngredientList />
            </div>
            <div className="p-4">
                <IngredientForm />
            </div>
            
        </div>
     );
}
 
export default Ingredient;