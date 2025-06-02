// controllers/recipeController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const Recipe = require('../models/Recipe'); // Your Mongoose Recipe model
const User = require('../models/User');     // Your Mongoose User model

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Generate Recipe using OpenAI ---
exports.generateRecipe = async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: "Please provide a list of ingredients." });
    }

    const prompt = `
You are a helpful AI recipe assistant.
Given the following ingredients: ${ingredients.join(", ")}.
Generate a recipe that primarily uses these ingredients.

Your response MUST be a valid JSON object with the following structure:
{
  "title": "Name of the dish",
  "description": "A brief, enticing description of the dish.",
  "prepTime": "Estimated preparation time (e.g., '15 minutes')",
  "cookTime": "Estimated cooking time (e.g., '30 minutes')",
  "servings": "Number of servings (e.g., '4 servings')",
  "mainIngredientsUsed": ["Only list ingredients from the provided list"],
  "additionalIngredientsNeeded": [
    {"item": "Full ingredient name", "quantity": "e.g., 1 cup, 2 tbsp, to taste"}
  ],
  "instructions": [
    "Step 1: Detailed instruction...",
    "Step 2: Detailed instruction..."
  ],
  "tips": ["Optional tip 1", "Optional tip 2"]
}

Only output the JSON object. Do not include any extra text or formatting like markdown.
If essential common items like oil, salt, pepper are needed, add them in 'additionalIngredientsNeeded'.
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Handle possible wrapping in code block
        let recipeDataString = responseText;
        if (recipeDataString.startsWith("```json")) {
            recipeDataString = recipeDataString.slice(7);
            if (recipeDataString.endsWith("```")) {
                recipeDataString = recipeDataString.slice(0, -3);
            }
        }

        recipeDataString = recipeDataString.trim();

        let recipeData;
        try {
            recipeData = JSON.parse(recipeDataString);
        } catch (err) {
            console.error("Failed to parse Gemini JSON response:", err);
            return res.status(500).json({
                message: "Failed to parse recipe data from Gemini.",
                rawResponse: recipeDataString,
            });
        }

        res.status(200).json({ ...recipeData, sourceIngredients: ingredients });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: "Error generating recipe from Gemini", details: error.message });
    }
};

// --- Save a Generated Recipe ---
exports.saveRecipe = async (req, res) => {
    const { title, description, prepTime, cookTime, servings, mainIngredientsUsed, additionalIngredients, instructions, tips, imageUrl, sourceIngredients } = req.body;
    const userId = req.user._id; // From authMiddleware (protect route)

    if (!title || !instructions || !sourceIngredients) {
        return res.status(400).json({ message: "Missing required recipe fields (title, instructions, sourceIngredients)." });
    }

    try {
        const newRecipe = new Recipe({
            user: userId,
            title,
            description,
            prepTime,
            cookTime,
            servings,
            ingredients: mainIngredientsUsed, // Renamed from mainIngredientsUsed in request to 'ingredients' in schema
            additionalIngredients: Array.isArray(additionalIngredients)
                ? additionalIngredients.map(ing => `${ing.quantity || ''} ${ing.item}`.trim())
                : [],
            instructions,
            tips,
            imageUrl: imageUrl || null, // Optional
            sourceIngredients // The original ingredients user entered
        });

        const savedRecipe = await newRecipe.save();

        // Add to user's recipe history (optional, could also just query all recipes by user)
        await User.findByIdAndUpdate(userId, { $push: { recipeHistory: savedRecipe._id } });

        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.status(500).json({ message: "Error saving recipe", details: error.message });
    }
};

// --- Get User's Recipe History ---
exports.getUserRecipes = async (req, res) => {
    const userId = req.user._id; // From authMiddleware

    try {
        // Fetch recipes created by the user, sorted by most recent
        const recipes = await Recipe.find({ user: userId }).sort({ generatedAt: -1 });
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Error fetching user recipes:", error);
        res.status(500).json({ message: "Error fetching user recipes", details: error.message });
    }
};

// --- Add Recipe to Favorites ---
exports.addFavoriteRecipe = async (req, res) => {
    const userId = req.user._id;
    const { recipeId } = req.params; // Get recipeId from URL parameters

    if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required." });
    }

    try {
        // Check if the recipe exists (optional, but good practice)
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        // Add to user's favoriteRecipes array if not already present
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteRecipes: recipeId } }, // $addToSet prevents duplicates
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: 'Recipe added to favorites successfully.', favoriteRecipes: updatedUser.favoriteRecipes });
    } catch (error) {
        console.error("Error adding favorite recipe:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Recipe ID format.' });
        }
        res.status(500).json({ message: "Error adding recipe to favorites", details: error.message });
    }
};

// --- Remove Recipe from Favorites ---
exports.removeFavoriteRecipe = async (req, res) => {
    const userId = req.user._id;
    const { recipeId } = req.params;

    if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required." });
    }

    try {
        // Remove from user's favoriteRecipes array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteRecipes: recipeId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: 'Recipe removed from favorites successfully.', favoriteRecipes: updatedUser.favoriteRecipes });
    } catch (error) {
        console.error("Error removing favorite recipe:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Recipe ID format.' });
        }
        res.status(500).json({ message: "Error removing recipe from favorites", details: error.message });
    }
};

// --- Get User's Favorite Recipes ---
exports.getFavoriteRecipes = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: 'favoriteRecipes',
            model: 'Recipe', // Explicitly state the model for population
            options: { sort: { generatedAt: -1 } } // Optional: sort favorites
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.favoriteRecipes);
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        res.status(500).json({ message: "Error fetching favorite recipes", details: error.message });
    }
};