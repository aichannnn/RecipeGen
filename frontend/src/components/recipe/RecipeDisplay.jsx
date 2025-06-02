import React from 'react';
import { ClockIcon, UsersIcon, BookmarkIcon, StarIcon, CheckCircleIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';


const RecipeDisplay = ({ recipe, onSaveRecipe, isLoading }) => { // Added isLoading prop
  if (isLoading) { // Show loading state specifically for recipe display
    return (
      <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center text-white min-h-[300px] lg:min-h-0">
        <svg className="animate-spin h-12 w-12 text-custom-orange mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl">Generating your delicious recipe...</p>
        <p className="text-gray-400 text-sm">This might take a moment.</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center text-white min-h-[300px] lg:min-h-0">
        <SparklesIcon className="h-16 w-16 text-gray-600 mb-4" /> {/* Updated Icon */}
        <p className="text-xl text-gray-400">Your generated recipe will appear here.</p>
        <p className="text-gray-500 text-sm">Add ingredients and click "Generate Recipe" to start!</p>
      </div>
    );
  }

  const { dishName, description, prepTime, cookTime, servings, mainIngredientsUsed, additionalIngredientsNeeded, instructions, tips, imageUrl, sourceIngredients } = recipe;
  // const displayImage = imageUrl || DefaultFoodImage; // Use if you have a default image

  return (
    <div className="flex-1 bg-gray-800 p-6 md:p-8 rounded-xl shadow-xl border border-gray-700 text-white overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-custom-orange leading-tight">{dishName}</h2>
        {onSaveRecipe && ( // Only show save button if onSaveRecipe prop is provided
          <button
            onClick={() => onSaveRecipe(recipe)}
            title="Save Recipe"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-md"
          >
            <BookmarkIcon className="h-5 w-5 mr-2" /> Save
          </button>
        )}
      </div>

      {/* {imageUrl && <img src={displayImage} alt={dishName} className="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-lg"/>} */}

      {description && <p className="mb-6 text-gray-300 text-md">{description}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
        {prepTime && <div className="flex items-center bg-gray-700 p-3 rounded-lg"><ClockIcon className="h-5 w-5 mr-2 text-custom-orange" /> <span>Prep: {prepTime}</span></div>}
        {cookTime && <div className="flex items-center bg-gray-700 p-3 rounded-lg"><ClockIcon className="h-5 w-5 mr-2 text-custom-orange" /> <span>Cook: {cookTime}</span></div>}
        {servings && <div className="flex items-center bg-gray-700 p-3 rounded-lg"><UsersIcon className="h-5 w-5 mr-2 text-custom-orange" /> <span>Serves: {servings}</span></div>}
      </div>

      {sourceIngredients && sourceIngredients.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-custom-orange mb-2 flex items-center"><InformationCircleIcon className="h-5 w-5 mr-2" />Your Ingredients:</h4>
          <ul className="list-disc list-inside pl-5 text-gray-300 space-y-1">
            {sourceIngredients.map((ing, i) => <li key={`source-${i}`}>{ing}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        {mainIngredientsUsed && mainIngredientsUsed.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-custom-orange mb-2 flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />Main Ingredients Used:</h4>
            <ul className="list-disc list-inside pl-5 text-gray-300 space-y-1">
              {mainIngredientsUsed.map((ing, i) => <li key={`main-${i}`}>{ing}</li>)}
            </ul>
          </div>
        )}
        {additionalIngredientsNeeded && additionalIngredientsNeeded.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-custom-orange mb-2 flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />Additional Ingredients Needed:</h4>
            <ul className="list-disc list-inside pl-5 text-gray-300 space-y-1">
              {additionalIngredientsNeeded.map((ing, i) => (
                <li key={`add-${i}`}>{`${ing.quantity || ''} ${ing.item}`.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {instructions && instructions.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-custom-orange mb-3">Instructions:</h4>
          <ol className="list-decimal list-outside pl-5 space-y-3 text-gray-200">
            {instructions.map((step, i) => <li key={`step-${i}`} className="pl-2">{step}</li>)}
          </ol>
        </div>
      )}

      {tips && tips.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-custom-orange mb-2 flex items-center"><StarIcon className="h-5 w-5 mr-2 text-yellow-400" />Chef's Tips:</h4>
          <ul className="list-disc list-inside pl-5 space-y-1 text-gray-300">
            {tips.map((tip, i) => <li key={`tip-${i}`}>{tip}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
export default RecipeDisplay;