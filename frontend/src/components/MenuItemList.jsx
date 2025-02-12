import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for tracking which menu item is being edited
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  // Temporary state for holding edited values
  const [tempMenuItem, setTempMenuItem] = useState({});
  // State to toggle shopping list display
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Fetch menu items from the backend when the component mounts.
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  // Delete handler: Sends a DELETE request and then updates local state.
  const handleDelete = async (menuItemId) => {
    try {
      const res = await fetch(`/api/menu/${menuItemId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete menu item");
      }
      // Update local state by filtering out the deleted item.
      const newItems = menuItems.filter(
        (item) => item.menu_item_id !== menuItemId
      );
      setMenuItems(newItems);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError(err.message);
    }
  };

  // Begin editing a menu item by storing its current data.
  const handleEditStart = (item) => {
    setEditingMenuItem(item);
    setTempMenuItem({
      day_of_week: item.day_of_week,
      label: item.label,
      quantity: item.quantity,
    });
  };

  // Save changes made to the menu item.
  const handleEditSave = async (menuItemId) => {
    try {
      const res = await fetch(`/api/menu/${menuItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempMenuItem),
      });
      if (!res.ok) {
        throw new Error("Failed to update menu item");
      }
      // Parse the updated menu item from the response.
      const updatedItem = await res.json();
      // Update the local state with the updated item.
      const newItems = menuItems.map((item) =>
        item.menu_item_id === menuItemId ? updatedItem : item
      );
      setMenuItems(newItems);
      // Exit editing mode.
      setEditingMenuItem(null);
      setTempMenuItem({});
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError(err.message);
    }
  };

  // Cancel editing mode without saving changes.
  const handleEditCancel = () => {
    setEditingMenuItem(null);
    setTempMenuItem({});
  };

  // Compute the shopping list by aggregating ingredients across all menu items.
  const generateShoppingList = () => {
    const ingredientMap = {};
    menuItems.forEach((menuItem) => {
      if (menuItem.dish && menuItem.dish.dishIngredients) {
        menuItem.dish.dishIngredients.forEach((di) => {
          const ingredientId = di.ingredient_id;
          const ingredientName = di.ingredient?.ingredient_name || "Unknown ingredient";
          // Multiply the dish ingredient quantity by the menu item quantity (defaulting to 1 if not provided)
          const dishIngredientQuantity = di.quantity || 0;
          const menuItemQuantity = menuItem.quantity || 1;
          const total = dishIngredientQuantity * menuItemQuantity;

          if (ingredientMap[ingredientId]) {
            ingredientMap[ingredientId].totalQuantity += total;
          } else {
            ingredientMap[ingredientId] = {
              ingredient_id: ingredientId,
              ingredient_name: ingredientName,
              totalQuantity: total,
            };
          }
        });
      }
    });
    return Object.values(ingredientMap);
  };

  if (loading) return <p>Loading menu items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Current Menu of the Week</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.menu_item_id} className="border p-3 rounded">
            <p>
              <strong>Dish:</strong> {item.dish?.dish_name || "Unknown dish"}
            </p>
            {editingMenuItem &&
            editingMenuItem.menu_item_id === item.menu_item_id ? (
              // Render input fields for editing.
              <>
                <p>
                  <strong>Day:</strong>{" "}
                  <Input
                    value={tempMenuItem.day_of_week}
                    onChange={(e) =>
                      setTempMenuItem({
                        ...tempMenuItem,
                        day_of_week: e.target.value,
                      })
                    }
                  />
                </p>
                <p>
                  <strong>Label:</strong>{" "}
                  <Input
                    value={tempMenuItem.label}
                    onChange={(e) =>
                      setTempMenuItem({ ...tempMenuItem, label: e.target.value })
                    }
                  />
                </p>
                <p>
                  <strong>Quantity:</strong>{" "}
                  <Input
                    type="number"
                    value={tempMenuItem.quantity}
                    onChange={(e) =>
                      setTempMenuItem({
                        ...tempMenuItem,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleEditSave(item.menu_item_id)}>
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleEditCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              // Display the menu item details.
              <>
                <p>
                  <strong>Day:</strong> {item.day_of_week}
                </p>
                <p>
                  <strong>Label:</strong> {item.label}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleEditStart(item)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.menu_item_id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Button to toggle shopping list display */}
      <div className="mt-6">
        <Button onClick={() => setShowShoppingList(!showShoppingList)}>
          {showShoppingList ? "Hide Shopping List" : "Generate Shopping List"}
        </Button>
      </div>

      {/* Render shopping list if toggled on */}
      {showShoppingList && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Shopping List</h3>
          <ul className="mt-2 space-y-1">
            {generateShoppingList().map((ingredient) => (
              <li key={ingredient.ingredient_id}>
                {ingredient.ingredient_name}: {ingredient.totalQuantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuItemList;
