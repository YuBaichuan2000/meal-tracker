import { Router } from 'express';
import { getDishes, createDish, getDishById, updateDish, deleteDish } from '../controllers/dish.controller.js';

const router = Router();

// get all dishes
router.get('/', getDishes);

// get a dish
router.get('/:id', getDishById);

// create a dish
router.post('/', createDish);

// update a dish
router.patch('/:id', updateDish);

// delete a dish
router.delete('/:id', deleteDish);

export default router;
