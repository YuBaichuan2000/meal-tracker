import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const MenuItemList = () => {
  // Hardcoded initial data
  const [menuItems, setMenuItems] = useState([
    {
      menu_item_id: 1,
      dish: { dish_name: "Spaghetti Bolognese" },
      day_of_week: "Monday",
      label: "Lunch",
      quantity: 2,
    },
    {
      menu_item_id: 2,
      dish: { dish_name: "Chicken Salad" },
      day_of_week: "Tuesday",
      label: "Dinner",
      quantity: 1,
    },
    {
      menu_item_id: 3,
      dish: { dish_name: "Veggie Pizza" },
      day_of_week: "Friday",
      label: "Lunch",
      quantity: 3,
    },
  ]);

  // Example delete handler (mocked)
  const handleDelete = (menuItemId) => {
    // Filter out the item that matches the ID
    const newItems = menuItems.filter((item) => item.menu_item_id !== menuItemId);
    setMenuItems(newItems);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Menu of the Week</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.menu_item_id} className="border p-3 rounded">
            <p>Dish: {item.dish?.dish_name || "Unknown dish"}</p>
            <p>Day: {item.day_of_week}</p>
            <p>Label: {item.label}</p>
            <p>Quantity: {item.quantity}</p>
            <Button
              variant="destructive"
              onClick={() => handleDelete(item.menu_item_id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItemList;
