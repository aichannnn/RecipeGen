const express = require('express');
const {
    generateRecipe,
    saveRecipe,
    getUserRecipes,
    addFavoriteRecipe,
    removeFavoriteRecipe,
    getFavoriteRecipes
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', protect, generateRecipe);
router.post('/save', protect, saveRecipe);
router.get('/', protect, getUserRecipes); // Gets recipe history
router.post('/favorites/:recipeId', protect, addFavoriteRecipe);
router.delete('/favorites/:recipeId', protect, removeFavoriteRecipe);
router.get('/favorites', protect, getFavoriteRecipes);

module.exports = router;