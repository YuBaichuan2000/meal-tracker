import prisma from "../prisma.js";

const getDishes = async (req, res) => {
    try {
      const dishes = await prisma.Dish.findMany({
        include: {
          dishIngredients: {
            include: {
              ingredient: true, // Include the related ingredient data
            },
          },
        },
      });
      res.json(dishes);
    } catch (e) {
      res.status(500).json({ error: 'Error getting dishes' });
    }
  };

const getDishById = async (req, res) => {
  const { id } = req.params;

  try {
    const dish = await prisma.dish.findUnique({
      where: { dish_id: parseInt(id) },
      include: { ingredients: true },
    });
    res.json(dish);
  } catch (e) {
    res.status(500).json({ error: "Error getting dish" });
  }
};

const createDish = async (req, res) => {
  try {
    // console.log("createDish - req.body:", req.body);
    const { dishName, ingredients } = req.body;
    // console.log("createDish - dishName:", dishName);
    // console.log("createDish - ingredients:", ingredients);

    // if (!Array.isArray(ingredients)) {
    //   console.error("Ingredients is not an array:", ingredients);
    //   return res.status(400).json({ error: "Ingredients must be an array" });
    // }

    // extract all ingredient ids from the request body
    const ingredientIds = ingredients.map(
      (ingredient) => ingredient.ingredient_id
    );
    // console.log("createDish - ingredientIds:", ingredientIds);

    const foundIngredients = await prisma.ingredients.findMany({
      where: { ingredient_id: { in: ingredientIds } },
    });
    // console.log("createDish - foundIngredients:", foundIngredients);

    if (foundIngredients.length !== ingredientIds.length) {
      return res.status(400).json({ error: "Invalid ingredient ids" });
    }

    const dishIngredients = ingredients.map((ing) => {
      return {
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity || 1,
      };
    });

    // console.log("createDish - dishIngredients:", dishIngredients);

    let newDish;
    try {
      newDish = await prisma.Dish.create({
        data: {
          dish_name: dishName,
          dishIngredients: {
            create: dishIngredients
          }
        },
        include: {
          dishIngredients: {
            include: { ingredient: true }
          }
        }
      });
      // console.log("createDish - newDish:", newDish);
    } catch (createError) {
      console.error("Error during prisma.Dish.create:", createError.message);
      // if (createError.meta) {
      //   console.error("Additional error info:", createError.meta);
      // }
      throw createError;
    }

    return res.json(newDish);
  } catch (e) {
    // console.error("Error creating dish:", e.message);
    // Optionally, send the error details back (only in development)
    res.status(500).json({ error: 'Error creating dish', details: e.message });
  }
};

const updateDish = async (req, res) => {
  const { id } = req.params;
  const { dishName, ingredients } = req.body; // Expecting dishName and an array of ingredients objects

  try {
    // Extract ingredient IDs from the request body
    const ingredientIds = ingredients.map((ingredient) => ingredient.ingredient_id);

    // Look up the ingredients using the correct model name (Ingredients)
    const foundIngredients = await prisma.Ingredients.findMany({
      where: { ingredient_id: { in: ingredientIds } },
    });

    if (foundIngredients.length !== ingredientIds.length) {
      return res.status(400).json({ error: "Invalid ingredient ids" });
    }

    // Map the ingredients into the format expected for the nested write.
    // Note: We're now updating the nested relation field "dishIngredients"
    // and using the "quantity" field, which is an Int per your updated schema.
    const dishIngredients = ingredients.map((ing) => ({
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity || 1, // default quantity is 1 if not provided
    }));

    const updatedDish = await prisma.Dish.update({
      where: { dish_id: parseInt(id, 10) },
      data: {
        dish_name: dishName,
        dishIngredients: {
          // Remove all existing dish ingredients for this dish
          deleteMany: {},
          // And then create the new ones based on the updated data
          create: dishIngredients,
        },
      },
      include: {
        dishIngredients: {
          include: { ingredient: true },
        },
      },
    });

    res.json(updatedDish);
  } catch (e) {
    console.error("Error updating dish:", e.message);
    res.status(500).json({ error: "Error updating dish", details: e.message });
  }
};


const deleteDish = async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete all related DishIngredients for this dish.
    // This prevents foreign key errors if the relation does not cascade.
    await prisma.DishIngredients.deleteMany({
      where: { dish_id: parseInt(id, 10) },
    });

    // Now delete the dish itself.
    await prisma.Dish.delete({
      where: { dish_id: parseInt(id, 10) },
    });

    res.json({ message: "Dish deleted" });
  } catch (e) {
    console.error("Error deleting dish:", e.message);
    res.status(500).json({ error: "Error deleting dish", details: e.message });
  }
};


export { getDishes, createDish, getDishById, updateDish, deleteDish };
