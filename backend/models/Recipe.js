const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },

  title: {
      type: String,
      required: true
    },
  
  ingredients: [
    {
      type: String
    }
  ],
  
  additionalIngredients: [
    {
      type: String
    }
  ],

  instructions: [
    {
      type: String
    }
  ],

  imageUrl: {
    type: String
  },

  generatedAt: {
    type: Date,
    default: Date.now
  },

  sourceIngredients: [
    {
      type: String
    }
  ]

})

module.exports = mongoose.model('Recipe', RecipeSchema);