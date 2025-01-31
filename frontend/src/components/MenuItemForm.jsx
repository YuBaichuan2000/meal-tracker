"use client";

import React, { useState, useEffect } from "react";
// import { toast } from "sonner";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// 1) Define your Zod schema for the form fields
const formSchema = z.object({
  dish_id: z.coerce.number().min(1, "Please select a valid dish"),
  day_of_week: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  label: z.enum(["Breakfast", "Lunch", "Dinner"]),
  quantity: z.coerce.number().min(1),
});

export default function MenuItemForm() {
  const [dishes, setDishes] = useState([]);

  // 2) Create the React Hook Form instance, using Zod as a resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dish_id: 0,
      day_of_week: "Monday",
      label: "Lunch",
      quantity: 1,
    },
  });

  // 3) Fetch the list of dishes on mount (for the dropdown)
  useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch("/api/dish");
        const data = await res.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    }
    fetchDishes();
  }, []);

  // 4) Submission handler (Zod validation + async fetch to create menu item)
  async function onSubmit(values) {
    try {
      console.log("Form values:", values);
      const body = {
        user_id: 1, // or get from context if you have auth
        dish_id: values.dish_id,
        day_of_week: values.day_of_week,
        label: values.label,
        quantity: values.quantity,
      };

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Menu item created successfully");
        // reset form to defaults
        form.reset();
      } else {
        toast.error("Error creating menu item");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl mx-auto py-6"
      >
        <h2 className="text-xl font-bold">Create Menu Item</h2>

        {/* Dish Field */}
        <FormField
          control={form.control}
          name="dish_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Dish</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a dish" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishes.map((dish) => (
                      <SelectItem key={dish.dish_id} value={String(dish.dish_id)}>
                        {dish.dish_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Choose an existing dish.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Day of Week Field */}
        <FormField
          control={form.control}
          name="day_of_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day of Week</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Which day is this dish for?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label Field (Breakfast, Lunch, Dinner) */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Label</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Which meal is this dish for?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity ({field.value})</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                />
              </FormControl>
              <FormDescription>Adjust how many servings.</FormDescription>
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
