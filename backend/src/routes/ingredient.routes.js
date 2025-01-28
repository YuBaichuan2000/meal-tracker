import { Router } from 'express';
import { getIngredients, createIngredient, getIngredientById, updateIngredient, deleteIngredient } from '../controllers/ingredient.controller.js';


const router = Router();

// get all ingredients
router.get('/', getIngredients);

// get an ingredient
router.get('/:id', getIngredientById);

// create an ingredient
router.post('/', createIngredient);

// update an ingredient
router.patch('/:id', updateIngredient);

// delete an ingredient
router.delete('/:id', deleteIngredient);

export default router;