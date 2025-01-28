import prisma from '../prisma.js';

const getIngredients = async (req, res) => {
    try {
        const ingredients = await prisma.ingredients.findMany();
        res.json(ingredients);
    } catch(e) {
        res.status(500).json({error: 'Error getting ingredients'});
    }
}

const getIngredientById = async (req, res) => {
    const { id } = req.params;

    try {
        const ingredient = await prisma.ingredients.findUnique({
            where: {ingredient_id: parseInt(id)}
        });
        res.json(ingredient);
    } catch (e) {
        res.status(500).json({error: 'Error getting ingredient'});
    }
};

const createIngredient = async (req, res) => {
    const { name } = req.body;

    try {
        const newIngredient = await prisma.ingredients.create({
            data: {ingredient_name: name}
        });
        res.json(newIngredient);
    } catch(e) {
        res.status(500).json({error: 'Error creating ingredient'});
    }
}

const updateIngredient = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedIngredient = await prisma.ingredients.update({
            where: {ingredient_id: parseInt(id)},
            data: {ingredient_name: name}
        });
        res.json(updatedIngredient);
    } catch (e) {
        res.status(500).json({error: 'Error updating ingredient'});
    }
}

const deleteIngredient = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.ingredients.delete({
            where: {ingredient_id: parseInt(id)},
        });
        res.json({message: 'Ingredient deleted'});
    } catch (e) {
        res.status(500).json({error: 'Error deleting ingredient'});
    }
}

export { getIngredients, createIngredient, getIngredientById, updateIngredient, deleteIngredient };