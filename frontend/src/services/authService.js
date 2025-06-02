import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/`;

const register = async(userData) =>{
  const response = await axios.post(API_URL + 'register', userData);
  if(response.data && response.data.token){
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async(userData)=>{
  const response = await axios.post(API_URL+ 'login', userData);
  if(response.data && response.data.token){
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data
};

const logout = () => {
  localStorage.removeItem('userInfo');
};

const authService = {register, login, logout};
export default authService;