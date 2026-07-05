// client/src/services/auth.js
import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  googleLogin: async (userData) => {
    const response = await api.post('/auth/google', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const recipeService = {
  getAll: async (page = 1, limit = 10, category = '') => {
    console.log(`📤 API Call: /recipes?page=${page}&limit=${limit}&category=${category}`);
    const response = await api.get(`/recipes?page=${page}&limit=${limit}&category=${category}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/recipes/featured');
    return response.data;
  },

  getPopular: async () => {
    const response = await api.get('/recipes/popular');
    return response.data;
  },

  getById: async (id) => {
    console.log(`📤 API Call: /recipes/${id}`);
    const response = await api.get(`/recipes/${id}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  create: async (data) => {
    console.log(`📤 API Call: /recipes`);
    const response = await api.post('/recipes', data);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  update: async (id, data) => {
    console.log(`📤 API Call: /recipes/${id}`);
    const response = await api.put(`/recipes/${id}`, data);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  delete: async (id) => {
    console.log(`📤 API Call: /recipes/${id}`);
    const response = await api.delete(`/recipes/${id}`);
    console.log(`📥 API Response:`, response.data)  ;
    return response.data;
  },

  toggleLike: async (id, action) => {
    console.log(`📤 API Call: /recipes/${id}/like?action=${action}`);
    const response = await api.post(`/recipes/${id}/like?action=${action}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  report: async (id, data) => {
    console.log(`📤 API Call: /recipes/${id}/report`);
    const response = await api.post(`/recipes/${id}/report`, data);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getMyRecipes: async () => {
    const response = await api.get('/recipes/my-recipes');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    console.log(`📤 API Call: /users/profile`);
    const response = await api.get('/users/profile');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  updateProfile: async (data) => {
    console.log(`📤 API Call: /users/profile`);
    const response = await api.put('/users/profile', data);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getStats: async () => {
    console.log(`📤 API Call: /users/stats`);
    const response = await api.get('/users/stats');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getFavorites: async () => {
    console.log(`📤 API Call: /users/favorites`);
    const response = await api.get('/users/favorites');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  toggleFavorite: async (recipeId) => {
    console.log(`📤 API Call: /users/favorites/${recipeId}`);
    const response = await api.post(`/users/favorites/${recipeId}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  checkFavorite: async (recipeId) => {
    console.log(`📤 API Call: /users/favorites/check/${recipeId}`);
    const response = await api.get(`/users/favorites/check/${recipeId}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },
};

export const paymentService = {
  createPremiumCheckout: async () => {
    const response = await api.post('/payment/create-premium-checkout');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  createRecipeCheckout: async (recipeId) => {
    const response = await api.post('/payment/create-recipe-checkout', { recipeId });
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  verifyPayment: async (sessionId) => {
    const response = await api.get(`/payment/verify?sessionId=${sessionId}`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  // ✅ Purchased Recipes ফেচ করার নতুন মেথড
  getPurchasedRecipes: async () => {
    const response = await api.get('/payment/purchased');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },
};

export const adminService = {
  getOverview: async () => {
    const response = await api.get('/admin/overview');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  toggleBlockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/block`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getRecipes: async () => {
    const response = await api.get('/admin/recipes');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  toggleFeatureRecipe: async (recipeId) => {
    const response = await api.put(`/admin/recipes/${recipeId}/feature`);
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/admin/reports');
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },

  handleReport: async (reportId, action) => {
    const response = await api.put(`/admin/reports/${reportId}`, { action });
    console.log(`📥 API Response:`, response.data);
    return response.data;
  },
};