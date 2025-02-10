"use client";

import React from "react";
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

// 1) Define a simple Zod schema with just the "name" field
const formSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
});

export default function IngredientForm() {
  // 2) Create the React Hook Form instance
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 3) Submission handler (Zod validation + async fetch to create ingredient)
  async function onSubmit(values) {
    try {
      console.log("Form values:", values);
      const body = { name: values.name };

      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // If you have a toast library, you can replace alert with that.
        alert("Ingredient created successfully");
        form.reset();
        // Dispatch a custom event so that IngredientList can re-fetch the list.
        window.dispatchEvent(new Event("ingredientCreated"));
      } else {
        alert("Error creating ingredient");
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
        <h2 className="text-xl font-bold">Add New Ingredient</h2>

        {/* Ingredient Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Tomato"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the name of the ingredient.
              </FormDescription>
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
