import { useState } from "react"
import recipeService from "../services/recipeService";
import Header from "../components/layout/Header";
import IngredientInput from "../components/recipe/IngredientInput";
import RecipeDisplay from "../components/recipe/RecipeDisplay";


const MainPage = () => {
  const [generatedRecipe, setGeneratedRecipes] = useState(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState(null);

  const handleGenerateRecipe = async (ingredients) => {
    setIsLoadingRecipe(true);
    setGeneratedRecipes(null);
    setRecipeError(null);

    try {
      const data = await recipeService.generateRecipe({ ingredients });
      setGeneratedRecipes(data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.details?.message || error.message || "Failed to generate recipe";
      console.error("Recipe Generation Error:", error.response?.data || error);
      setRecipeError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleSaveRecipe = async (recipeToSave) => {
    if (!recipeToSave) {
      alert("No recipe to save");
      return;
    }

    const payload = {
      title: recipeToSave.title,
      description: recipeToSave.description,
      prepTime: recipeToSave.prepTime,
      cookTime: recipeToSave.cookTime,
      servings: recipeToSave.servings,
      mainIngredientsUsed: recipeToSave.mainIngredientsUsed,
      additionalIngredients: recipeToSave.additionalIngredientsNeeded, // Ensure this is an array of {item, quantity}
      instructions: recipeToSave.instructions,
      tips: recipeToSave.tips,
      imageUrl: recipeToSave.imageUrl || null,
      sourceIngredients: recipeToSave.sourceIngredients,
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const saved = await recipeService.saveRecipe(payload);
      alert('Recipe saved successfully!'); // Replace with a toast notification
      // Optionally clear generatedRecipe or update UI
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to save recipe";
      alert(`Error saving recipe: ${errorMsg}`);
    }

  }


  return (

    <div className="flex flex-col min-h-screen bg-custom-black text-white">
      <Header />
      <div className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
        <IngredientInput
          onGenerateRecipe={handleGenerateRecipe}
          isLoading={isLoadingRecipe}
        />

        <RecipeDisplay
          recipe={generatedRecipe}
          onSaveRecipe={handleSaveRecipe}
          isLoading={isLoadingRecipe && !generatedRecipe} // Show loading in display only if no recipe shown yet
        />
      </div>
      <div>
        {recipeError && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-700 text-white py-3 px-6 rounded-lg shadow-xl text-center">
            <p><strong>Error:</strong>{recipeError}</p>
            <button onClick={() => setRecipeError(null)} className="text-sm underline mt-1"> Dismiss </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default MainPage;