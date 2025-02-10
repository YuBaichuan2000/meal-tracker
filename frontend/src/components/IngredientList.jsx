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

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9;

  // Fetch ingredients on mount and when a new ingredient is created
  useEffect(() => {
    fetchIngredients();

    // Listen for the custom event
    const handleIngredientCreated = () => {
      fetchIngredients();
    };
    window.addEventListener("ingredientCreated", handleIngredientCreated);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("ingredientCreated", handleIngredientCreated);
    };
  }, []);

  async function fetchIngredients() {
    try {
      const res = await fetch("/api/ingredients");
      const data = await res.json();
      setIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(ingredients.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentIngredients = ingredients.slice(indexOfFirstItem, indexOfLastItem);

  // Delete ingredient
  async function handleDelete(ingredientId) {
    try {
      await fetch(`/api/ingredients/${ingredientId}`, { method: "DELETE" });
      setIngredients((prev) =>
        prev.filter((ing) => ing.ingredient_id !== ingredientId)
      );
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  }

  // Enter edit mode for an ingredient
  function handleEditStart(ingredient) {
    setEditingId(ingredient.ingredient_id);
    setTempName(ingredient.ingredient_name);
  }

  // Save edited ingredient
  async function handleEditSave(ingredientId) {
    try {
      const res = await fetch(`/api/ingredients/${ingredientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempName }),
      });
      if (res.ok) {
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.ingredient_id === ingredientId
              ? { ...ing, ingredient_name: tempName }
              : ing
          )
        );
        setEditingId(null);
      } else {
        console.error("Error updating ingredient");
      }
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  }

  // Cancel edit
  function handleEditCancel() {
    setEditingId(null);
    setTempName("");
  }

  // Pagination Handlers
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Ingredients</h2>

      {/* 3×3 grid of current page's ingredients */}
      <div className="grid grid-cols-3 gap-4">
        {currentIngredients.map((ing) => {
          const isEditing = editingId === ing.ingredient_id;
          return (
            <Card key={ing.ingredient_id}>
              <CardHeader>
                {isEditing ? (
                  <CardTitle>Editing Ingredient</CardTitle>
                ) : (
                  <CardTitle>{ing.ingredient_name}</CardTitle>
                )}
              </CardHeader>

              <CardContent>
                {isEditing ? (
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {/* Additional ingredient details could go here */}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={() => handleEditSave(ing.ingredient_id)}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEditStart(ing)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(ing.ingredient_id)}
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
}
