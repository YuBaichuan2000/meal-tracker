import prisma from "../prisma.js";

// GET menu items filtered by a period (using created_at)
const getMenu = async (req, res) => {
  const { period } = req.query;
  const currentDate = new Date();
  let startDate = new Date(0);

  if (period === "last_week") {
    startDate.setDate(currentDate.getDate() - 7);
  }
  if (period === "last_month") {
    startDate.setMonth(currentDate.getMonth() - 1);
  }
  if (period === "last_quarter") {
    startDate.setMonth(currentDate.getMonth() - 3);
  }

  try {
    const menu = await prisma.menuItem.findMany({
      where: {
        created_at: { gte: startDate },
      },
      include: {
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
    res.json(menu);
  } catch (e) {
    console.error("Error in getMenu:", e);
    res.status(500).json({ error: "Error getting menu" });
  }
};

// GET single menu item by ID
const getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { menu_item_id: parseInt(id, 10) },
      include: {
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
    if (!menuItem) {
      return res.status(404).json({ error: "No such menu item" });
    }
    res.json(menuItem);
  } catch (e) {
    console.error("Error in getMenuItemById:", e);
    res.status(500).json({ error: "Error getting menu item" });
  }
};

// CREATE a new menu item
const createMenuItem = async (req, res) => {
  try {
    // Removed user_id from the request body
    const { dish_id, quantity, label, day_of_week } = req.body;

    const newMenuItem = await prisma.menuItem.create({
      data: {
        dish_id,
        quantity: quantity ?? 1,
        label,      // Must match enum if provided (e.g., "Lunch" or "Dinner")
        day_of_week, // Must match enum (e.g., "Monday", "Tuesday", etc.)
      },
      include: {
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
    res.json(newMenuItem);
  } catch (e) {
    console.error("Error in createMenuItem:", e);
    res.status(500).json({ error: "Error creating menu item" });
  }
};

// UPDATE an existing menu item
const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  // Removed user_id from the request body
  const { dish_id, quantity, label, day_of_week } = req.body;

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { menu_item_id: parseInt(id, 10) },
      data: {
        dish_id,
        quantity,
        label,
        day_of_week,
      },
      include: {
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
    res.json(updatedMenuItem);
  } catch (error) {
    console.error("Error in updateMenuItem:", error);
    res.status(500).json({ error: "Error updating menu item" });
  }
};

// DELETE a menu item
const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.menuItem.delete({
      where: { menu_item_id: parseInt(id, 10) },
    });
    res.json({ message: "Menu item deleted" });
  } catch (e) {
    console.error("Error in deleteMenuItem:", e);
    res.status(500).json({ error: "Error deleting menu item" });
  }
};

// GENERATE grocery list based on a menu item's dish ingredients
const generateGrocery = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { menu_item_id: parseInt(id, 10) },
      include: {
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Generate grocery list by multiplying each dish ingredient quantity by the menu item's quantity
    const groceryList = menuItem.dish.dishIngredients.map((di) => {
      return {
        ingredient_id: di.ingredient.ingredient_id,
        ingredient_name: di.ingredient.ingredient_name,
        total_quantity: di.quantity * menuItem.quantity,
      };
    });

    res.json(groceryList);
  } catch (e) {
    console.error("Error in generateGrocery:", e);
    res.status(500).json({ error: "Error generating grocery list" });
  }
};

export {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  generateGrocery,
};
