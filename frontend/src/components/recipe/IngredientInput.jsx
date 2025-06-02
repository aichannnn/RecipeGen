import React, { useState } from 'react';
import { PlusCircleIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/solid';

const IngredientInput = ({ onGenerateRecipe, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);

  const handleAddIngredient = () => {
    const trimmedInput = inputValue.trim().toLocaleLowerCase();
    if (trimmedInput && !ingredientsList.some(ing => ing.toLowerCase() === trimmedInput)) {
      setIngredientsList([...ingredientsList, inputValue.trim()]); // Keep original casing for display
      setInputValue('');
    } else if (trimmedInput) {
      alert("Ingredient already added or invalid.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredientsList(ingredientsList.filter(ing => ing !== ingredientToRemove));
  };

  const handleSubmit = () => {
    if (ingredientsList.length > 0) {
      onGenerateRecipe(ingredientsList);
    } else {
      alert("Please add some ingredient first!");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 w-full lg:w-1/3 lg:max-w-md flex flex-col">
      <h3 className="text-2xl font-semibold text-custom-orange mb-6 text-center">
        Your Ingredients
      </h3>

      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., chicken breast, onion"
          className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-custom-orange focus:border-transparent outline-none"
        />
        <button
          onClick={handleAddIngredient}
          title="Add Ingredient"
          className="bg-custom-orange text-white p-3 rounded-r-lg bg-orange-600 hover:bg-orange-400 hover:text-black font-semibold transition-colors flex items-center"
        >
          <PlusCircleIcon className="h-5 w-5 mr-1" /> Add
        </button>
      </div>
      {ingredientsList.length > 0 && (
        <div className="mb-6 bg-gray-700 p-4 rounded-lg max-h-60 overflow-y-auto custom-scrollbar">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Added ({ingredientsList.length}):</h4>
          <ul className="space-y-2">
            {ingredientsList.map((ing, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-600 px-3 py-2 rounded-md text-white text-sm group">
                <span>{ing}</span>
                <button
                  onClick={() => handleRemoveIngredient(ing)}
                  title="Remove Ingredient"
                  className="text-red-400 hover:text-red-300 opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {ingredientsList.length === 0 && (
        <p className="text-gray-500 text-sm text-center mb-6">Add ingredients to get started.</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading || ingredientsList.length === 0}
        className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="h-6 w-6 mr-2" /> Generate Recipe
          </>
        )}
      </button>
    </div>
  )

}
export default IngredientInput;