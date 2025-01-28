import { Router } from 'express';
import { getMenu, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem, generateGrocery } from '../controllers/menu.controller.js';

const router = Router();

// get all menu items
router.get('/', getMenu);

// get a menu item
router.get('/:id', getMenuItemById);

// create a menu item
router.post('/', createMenuItem);

// update a menu item
router.patch('/:id', updateMenuItem);

// delete a menu item
router.delete('/:id', deleteMenuItem);

// generate grocery list
router.get('/grocery', generateGrocery);

export default router;

