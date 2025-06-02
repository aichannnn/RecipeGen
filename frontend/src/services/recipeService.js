import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/recipes/`

const getToken = () =>{
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

const generateRecipe = async (ingredientData) =>{
  const token =getToken();
  const config = {headers: {Authorization: `Bearer ${token}`}};
  const response = await axios.post(API_URL + 'generate', ingredientData, config);
  return response.data;
};

const saveRecipe =async (recipeData) =>{
  const token = getToken();
  const config = {headers: {Authorization: `Bearer ${token}`}};
  const response = await axios.post(API_URL + 'save', recipeData, config);
  return response.data;
};

const recipeService = {generateRecipe, saveRecipe};
export default recipeService;