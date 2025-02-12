import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDish, setEditingDish] = useState(null);
  const [tempDishName, setTempDishName] = useState("");
  const pageSize = 9;

  // Fetch dishes from your API
  async function fetchDishes() {
    try {
      const res = await fetch("/api/dishes");
      const data = await res.json();
      setDishes(data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  }

  // Fetch dishes on mount and listen for dish events
  useEffect(() => {
    fetchDishes();

    const handleDishChange = () => {
      fetchDishes();
    };

    // Listen for all dish-related events
    window.addEventListener("dishCreated", handleDishChange);
    window.addEventListener("dishUpdated", handleDishChange);
    window.addEventListener("dishDeleted", handleDishChange);

    return () => {
      window.removeEventListener("dishCreated", handleDishChange);
      window.removeEventListener("dishUpdated", handleDishChange);
      window.removeEventListener("dishDeleted", handleDishChange);
    };
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(dishes.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentDishes = dishes.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Delete dish handler
  const handleDelete = async (dishId) => {
    try {
      await fetch(`/api/dishes/${dishId}`, { method: "DELETE" });
      // Dispatch a custom event after deletion
      window.dispatchEvent(new Event("dishDeleted"));
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  // Start editing a dish
  const handleEditStart = (dish) => {
    setEditingDish(dish);
    setTempDishName(dish.dish_name);
  };

  // Save changes for an edited dish
  const handleEditSave = async () => {
    if (!editingDish) return;

    try {
      // Prepare updated ingredients from the existing dish.
      // (We send the current dishIngredients so they aren't lost on update.)
      const updatedIngredients = editingDish.dishIngredients.map((di) => ({
        ingredient_id: di.ingredient_id,
        quantity: di.quantity,
      }));

      const res = await fetch(`/api/dishes/${editingDish.dish_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: tempDishName,
          ingredients: updatedIngredients,
        }),
      });

      if (res.ok) {
        setEditingDish(null);
        setTempDishName("");
        // Dispatch a custom event after a successful update
        window.dispatchEvent(new Event("dishUpdated"));
      } else {
        console.error("Error updating dish");
      }
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingDish(null);
    setTempDishName("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dish List</h1>
      <div className="grid grid-cols-3 gap-4">
        {currentDishes.map((dish) => {
          const isEditing = editingDish && editingDish.dish_id === dish.dish_id;
          return (
            <Card key={dish.dish_id}>
              <CardHeader>
                {isEditing ? (
                  <CardTitle>
                    <Input
                      value={tempDishName}
                      onChange={(e) => setTempDishName(e.target.value)}
                    />
                  </CardTitle>
                ) : (
                  <CardTitle>{dish.dish_name}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {dish.dishIngredients && dish.dishIngredients.length > 0 ? (
                  <ul className="text-sm text-muted-foreground">
                    {dish.dishIngredients.map((di) => (
                      <li key={di.ingredient_id}>
                        {di.ingredient?.ingredient_name}{" "}
                        {di.quantity !== null && ` (Quantity: ${di.quantity})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ingredients listed.
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleEditSave}>Save</Button>
                    <Button variant="secondary" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEditStart(dish)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(dish.dish_id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DishList;
