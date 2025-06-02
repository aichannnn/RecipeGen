// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-landing-orange to-yellow-400 text-black p-6">
      <div className="absolute top-5 left-5 text-3xl font-bold tracking-wider">
        RecipeGen
      </div>

      <div className="text-center z-10 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
          Discover Your Next Meal
        </h1>
        <p className="text-xl md:text-2xl mb-10 mx-auto drop-shadow-md">
          Enter the ingredients you have, and let our AI craft delicious recipes just for you!
        </p>
        <Link
          to="/login"
          className="bg-white text-custom-orange font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-200 transition duration-300 ease-in-out shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Try It Now!
        </Link>
      </div>

      <div className="absolute bottom-6 text-center w-full text-sm opacity-75">
        <p>&copy; {new Date().getFullYear()} RecipeGen - Your AI Culinary Partner</p>
      </div>
    </div>
  );
};
export default LandingPage;