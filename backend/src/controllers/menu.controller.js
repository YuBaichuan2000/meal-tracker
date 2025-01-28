import prisma from "../prisma.js";

const getMenu = async (req, res) => {
  // get parameter based on last week, last month, or last quarter
  const { period } = req.query;

  // get the current date
  const currentDate = new Date();

  // get the date based on the period
  let startDate = new Date();

  if (period === "last_week") {
    startDate.setDate(currentDate.getDate() - 7);
  }

  if (period === "last_month") {
    startDate.setMonth(currentDate.getMonth() - 1);
  }

  if (period === "last_quarter") {
    startDate.setMonth(currentDate.getMonth() - 3);
  }

  // get the menu based on the start date
  try {
    const menu = await prisma.menu.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      include: {
        dish: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    res.json(menu);
  } catch (e) {
    res.status(500).json({ error: "Error getting menu" });
  }
};

const getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await prisma.menu.findUnique({
      where: { menu_id: parseInt(id) },
      include: {
        dish: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    res.json(menuItem);
  } catch (e) {
    res.status(500).json({ error: "Error getting menu item" });
  }
};

const createMenuItem = async (req, res) => {
    try {
        const { user_id, dish_id, quantity, label, day_of_week } = req.body;

        const newMenuItem = await prisma.menuItem.create({
            data: {
                user_id,
                dish_id,
                quantity: quantity ?? 1,
                label, // Must match enum if provided
                day_of_week, // Must match enum
            },
            include: {
                dish: true,
                user: true,
            },
        });

    res.json(newMenuItem);
    } catch (e) {
        res.status(500).json({ error: "Error creating menu item" });
    }
};

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { user_id, dish_id, quantity, label, day_of_week } = req.body;

    try {
        const updatedMenuItem = await prisma.menuItem.update({
            where: { menu_item_id: parseInt(id) },
            data: {
            user_id,
            dish_id,
            quantity,
            label,
            day_of_week,
            },
            include: {
            dish: true,
            user: true,
            },
        });
        res.json(updatedMenuItem);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating menu item' });
        }
};

const deleteMenuItem = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.menuItem.delete({
            where: { menu_item_id: parseInt(id) },
        });

        res.json({ message: 'Menu item deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Error deleting menu item' });
    }
};


const generateGrocery = async (req, res) => {
    const { id } = req.params;

    try {
        const menuItem = await prisma.menuItem.findUnique({
            where: { menu_item_id: parseInt(id) },
            include: {
                dish: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });

        const ingredients = menuItem.dish.ingredients;

        const groceryList = ingredients.map(ingredient => {
            return {
                ingredient_id: ingredient.ingredient_id,
                quantity: ingredient.quantity * menuItem.quantity,
            }
        });

        res.json(groceryList);
    } catch (e) {
        res.status(500).json({ error: 'Error generating grocery list' });
    }
}

export { getMenu, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem, generateGrocery };
