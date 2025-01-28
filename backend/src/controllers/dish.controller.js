import prisma from '../prisma.js';

const getDishes = async (req, res) => {
    try {
        const dishes = await prisma.dish.findMany();
        res.json(dishes);
    } catch(e) {
        res.status(500).json({error: 'Error getting dishes'});
    }
};

const getDishById = async (req, res) => {
    const { id } = req.params;

    try {
        const dish = await prisma.dish.findUnique({
            where: {dish_id: parseInt(id)},
            include: {ingredients: true}
        })
        res.json(dish);
    } catch (e) {
        res.status(500).json({error: 'Error getting dish'});
    }
};

const createDish = async (req, res) => {
    try {
        const { dishName, ingredients } = req.body;

        // extract all ingredient ids from the request body
        const ingredientIds = ingredients.map(ingredient => ingredient.ingredient_id);

        const foundIngredients = await prisma.ingredients.findMany({
            where: {ingredient_id: {in: ingredientIds}}
        });

        if (foundIngredients.length !== ingredientIds.length) {
            return res.status(400).json({error: 'Invalid ingredient ids'});
        }

        const dishIngredients = ingredients.map(ing => {
            return {
                ingredient_id: ing.ingredient_id,
                quantity: ing.quantity || 1
            }
        });

        const newDish = await prisma.dish.create({
            data: {
                dish_name: dishName,
                ingredients: {
                    create: dishIngredients
                }
            },
            include: {
                ingredients: true
            }
        });

        return res.json(newDish);
    } catch (e) {
        res.status(500).json({error: 'Error creating dish'});
    }
};


const updateDish = async (req, res) => {
    const { id } = req.params;
    const { dishName, ingredients } = req.body;

    try {

        const ingredientIds = ingredients.map(ingredient => ingredient.ingredient_id);

        const foundIngredients = await prisma.ingredients.findMany({
            where: {ingredient_id: {in: ingredientIds}}
        });

        if (foundIngredients.length !== ingredientIds.length) {
            return res.status(400).json({error: 'Invalid ingredient ids'});
        }

        const dishIngredients = ingredients.map(ing => {
            return {
                ingredient_id: ing.ingredient_id,
                quantity: ing.quantity || 1
            }
        });

        const updatedDish = await prisma.dish.update({
            where: {dish_id: parseInt(id)},
            data: {
                dish_name: dishName,
                ingredients: {
                    deleteMany: {},
                    create: dishIngredients
                }
            },
            include: {
                ingredients: true
            }
        });

        res.json(updatedDish);
    } catch (e) {
        res.status(500).json({error: 'Error updating dish'});
    }
};

const deleteDish = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.dish.delete({
            where: {dish_id: parseInt(id)},
        });
        res.json({message: 'Dish deleted'});
    } catch (e) {
        res.status(500).json({error: 'Error deleting dish'});
    }
};

export { getDishes, createDish, getDishById, updateDish, deleteDish };
