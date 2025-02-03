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

// shadcn Command components
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

// 1) Zod schema: require dish name, and a valid ingredient_id >= 1
const formSchema = z.object({
    name: z.string().min(1, "Dish name is required"),
    ingredient_id: z.number().min(1, "Please select a valid ingredient"),
  });
  
  export default function DishForm() {
    const [allIngredients, setAllIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showMenu, setShowMenu] = useState(false);
  
    // 2) React Hook Form setup
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        ingredient_id: 0, // 0 means none selected
      },
    });
    const { watch, setValue } = form;
  
    // 3) Fetch ingredients on mount
    useEffect(() => {
      async function fetchIngredients() {
        try {
          const res = await fetch("/api/ingredients");
          const data = await res.json();
          // Example data: [{ ingredient_id:1, ingredient_name:"tomato" }, ...]
          setAllIngredients(data);
        } catch (error) {
          console.error("Error fetching ingredients:", error);
        }
      }
      fetchIngredients();
    }, []);
  
    // 4) Filter the ingredient list by `searchTerm`
    const filteredIngredients = allIngredients.filter((ing) =>
      ing.ingredient_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  
    // 5) Handle selection from the dropdown
    function handleSelect(ingredient) {
      // Set the form's ingredient_id to the selected one
      setValue("ingredient_id", ingredient.ingredient_id);
      // Also set the searchTerm to the chosen name, so user sees it
      setSearchTerm(ingredient.ingredient_name);
      // Hide the menu
      setShowMenu(false);
    }
  
    // 6) Submission logic
    async function onSubmit(values) {
      // e.g. { name: 'Tomato Dish', ingredient_id: 3 }
      try {
        const body = {
          name: values.name,
          ingredient_id: values.ingredient_id,
        };
  
        const res = await fetch("/api/dish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        if (res.ok) {
          alert("Dish created successfully");
          form.reset(); // resets name + ingredient_id = 0
          setSearchTerm(""); // clear the typeahead input
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
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dish Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="e.g. 番茄黑鱼片"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the name of the dish.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Single Ingredient as a Typeahead */}
          <FormField
            control={form.control}
            name="ingredient_id"
            render={() => (
              <FormItem>
                <FormLabel>Ingredient</FormLabel>
                <FormDescription>Select one existing ingredient.</FormDescription>
  
                {/* 
                  Instead of a normal <Select>, we use a "command menu" 
                  that allows the user to type, see filtered results, and pick one. 
                */}
                <div className="relative mt-2">
                  <Input
                    placeholder="Search ingredient..."
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowMenu(true);
                    }}
                    onFocus={() => setShowMenu(true)}
                  />
  
                  {/* Only show the dropdown if showMenu is true and there's something to filter */}
                  {showMenu && (
                    <div className="absolute z-10 w-full bg-white border rounded shadow">
                      <Command>
                        <CommandInput
                          // Keep in sync with searchTerm
                          value={searchTerm}
                          onValueChange={(val) => {
                            setSearchTerm(val);
                          }}
                          placeholder="Type an ingredient..."
                        />
                        <CommandList>
                          {filteredIngredients.length > 0 ? (
                            filteredIngredients.map((ing) => (
                              <CommandItem
                                key={ing.ingredient_id}
                                onSelect={() => handleSelect(ing)}
                              >
                                {ing.ingredient_name}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandEmpty>No matching ingredients.</CommandEmpty>
                          )}
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
  
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