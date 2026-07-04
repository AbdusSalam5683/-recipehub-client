// client/src/hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { recipeService } from '../services/auth';
import toast from 'react-hot-toast';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchRecipes = async (page = 1, category = '') => {
    setLoading(true);
    try {
      const response = await recipeService.getAll(page, 10, category);
      if (response.success) {
        setRecipes(response.recipes);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    setLoading(true);
    try {
      const response = await recipeService.getFeatured();
      if (response.success) {
        return response.recipes;
      }
    } catch (error) {
      toast.error('Failed to fetch featured recipes');
    } finally {
      setLoading(false);
    }
    return [];
  };

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const response = await recipeService.getPopular();
      if (response.success) {
        return response.recipes;
      }
    } catch (error) {
      toast.error('Failed to fetch popular recipes');
    } finally {
      setLoading(false);
    }
    return [];
  };

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const response = await recipeService.getMyRecipes();
      if (response.success) {
        return response.recipes;
      }
    } catch (error) {
      toast.error('Failed to fetch your recipes');
    } finally {
      setLoading(false);
    }
    return [];
  };

  return {
    recipes,
    loading,
    pagination,
    fetchRecipes,
    fetchFeatured,
    fetchPopular,
    fetchMyRecipes,
  };
};