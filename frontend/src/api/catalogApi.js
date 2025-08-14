import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/catalog';

export const fetchCategories = () => axios.get(`${BASE_URL}/categories`);
export const fetchSubcategories = (categoryId) => axios.get(`${BASE_URL}/subcategories/${categoryId}`);
export const fetchProducts = (subcategoryId) => axios.get(`${BASE_URL}/products/${subcategoryId}`);
