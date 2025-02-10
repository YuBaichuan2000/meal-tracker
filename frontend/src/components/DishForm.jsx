"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/extension/multi-select";

// 1) Update Zod schema:
//    - Dish name is required
//    - "ingredients" is an array with at least one selected ingredient
const formSchema = z.object({
  name: z.string().min(1, "Dish name is required"),
  ingredients: z
    .array(z.string())
    .nonempty("Please select at least one ingredient"),
});

export default function DishForm() {
  const [allIngredients, setAllIngredients] = useState([]);

  // 2) React Hook Form setup using the updated schema.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ingredients: [], // none selected by default
    },
  });
  const { control } = form;

  // 3) Fetch ingredients on mount
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await fetch("/api/ingredients");
        const data = await res.json();
        // Expected data format:
        // [{ ingredient_id: 1, ingredient_name: "Tomato" }, { ingredient_id: 2, ingredient_name: "Basil" }, ...]
        setAllIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }
    fetchIngredients();
  }, []);

  // 4) Submission logic
  async function onSubmit(values) {
    try {
      // Transform the form values:
      const body = {
        dishName: values.name, // rename "name" to "dishName"
        // Map each selected ingredient id (which is a string) to an object with ingredient_id (as a number)
        ingredients: values.ingredients.map((id) => ({
          ingredient_id: parseInt(id, 10),
          quantity: 1, 
        })),
      };
  
      const res = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (res.ok) {
        // For example, using a toast library or alert:
        alert("Dish created successfully");
        form.reset();
      } else {
        alert("Error creating dish");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md mx-auto py-6"
      >
        <h2 className="text-xl font-bold">Add New Dish</h2>

        {/* Dish Name Field */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dish Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="e.g. Tomato Dish"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter the name of the dish.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Multi-Select Ingredients Field */}
        <FormField
          control={control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormDescription>Select one or more ingredients.</FormDescription>
              <MultiSelector
                values={field.value}
                onValuesChange={field.onChange}
                loop
                className="max-w-xs"
                getOptionLabel={(val) => {
                  // Look up the ingredient by matching the id (as a string)
                  const ing = allIngredients.find(
                    (i) => String(i.ingredient_id) === val
                  );
                  return ing ? ing.ingredient_name : val;
                }}
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder="Select ingredients" />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {allIngredients.map((ing) => (
                      <MultiSelectorItem
                        key={ing.ingredient_id}
                        value={String(ing.ingredient_id)}
                      >
                        <span>{ing.ingredient_name}</span>
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
