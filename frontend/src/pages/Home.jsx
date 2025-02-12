import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-6">
          <li>
            <Link to="/dish" className="text-white hover:underline">
              Dish
            </Link>
          </li>
          <li>
            <Link to="/ingredient" className="text-white hover:underline">
              Ingredient
            </Link>
          </li>
          <li>
            <Link to="/menu" className="text-white hover:underline">
              Menu
            </Link>
          </li>
        </ul>
      </nav>

      {/* Home Content */}
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Hello Home</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to the homepage! Use the navigation bar above to go to the Dish, Ingredient, or Menu pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
