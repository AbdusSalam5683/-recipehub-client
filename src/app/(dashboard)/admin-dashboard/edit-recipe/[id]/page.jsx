// client/src/app/(dashboard)/user-dashboard/edit-recipe/[id]/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { recipeService } from '@/services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/common/Loader';


const categories = [
  'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Soup', 'Salad'
];

const cuisineTypes = [
  'Bangladeshi', 'Indian', 'Chinese', 'Thai', 'Italian', 'Mexican', 'American', 'French', 'Japanese', 'Korean', 'Other'
];

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [originalImage, setOriginalImage] = useState('');

  const [formData, setFormData] = useState({
    recipeName: '',
    category: '',
    cuisineType: '',
    difficultyLevel: '',
    preparationTime: '',
    ingredients: '',
    instructions: '',
    recipeImage: '',
  });

  // ✅ Fetch recipe data
  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeService.getById(id);
      if (response.success) {
        const recipe = response.recipe;
        setFormData({
          recipeName: recipe.recipeName || '',
          category: recipe.category || '',
          cuisineType: recipe.cuisineType || '',
          difficultyLevel: recipe.difficultyLevel || '',
          preparationTime: recipe.preparationTime || '',
          ingredients: recipe.ingredients?.join(', ') || '',
          instructions: recipe.instructions || '',
          recipeImage: recipe.recipeImage || '',
        });
        setImagePreview(recipe.recipeImage || null);
        setOriginalImage(recipe.recipeImage || '');
      } else {
        toast.error('Recipe not found');
        router.push('/user-dashboard/my-recipes');
      }
    } catch (error) {
      toast.error('Failed to load recipe');
      router.push('/user-dashboard/my-recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, recipeImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipeName || !formData.category || !formData.instructions) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      let imageToSend = formData.recipeImage;

      // If new image uploaded, convert to base64
      if (imageFile) {
        const reader = new FileReader();
        imageToSend = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(Boolean),
        recipeImage: imageToSend,
      };

      const response = await recipeService.update(id, recipeData);
      if (response.success) {
        toast.success('Recipe updated successfully! 🎉');
        router.push('/user-dashboard/my-recipes');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update recipe');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Edit Recipe
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Update your recipe details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-2">
            Recipe Image
          </label>
          <div
            className="relative w-full h-48 rounded-xl border-2 border-dashed border-clay-300 dark:border-charcoal-700 overflow-hidden bg-cream-50 dark:bg-charcoal-800 cursor-pointer hover:border-paprika-500 dark:hover:border-turmeric-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Recipe preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-charcoal-900/70 text-cream-50 rounded-full hover:bg-charcoal-900 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <CameraIcon className="h-12 w-12 text-clay-400 dark:text-charcoal-600" />
                <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-2">
                  Click to upload new image
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Recipe Name */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Recipe Name *
          </label>
          <input
            type="text"
            name="recipeName"
            value={formData.recipeName}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Chicken Biryani"
            required
          />
        </div>

        {/* Category, Cuisine, Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
              Cuisine *
            </label>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select cuisine</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
              Difficulty *
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select difficulty</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preparation Time */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Preparation Time (minutes) *
          </label>
          <input
            type="number"
            name="preparationTime"
            value={formData.preparationTime}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., 30"
            min="1"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Ingredients *
          </label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Chicken 500g, Rice 2 cups, Onion 1 (separate with commas)"
            required
          />
          <p className="font-body text-xs text-charcoal-400 dark:text-cream-500 mt-1">
            Separate ingredients with commas
          </p>
        </div>

        {/* Instructions */}
        <div>
          <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
            Instructions *
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="input-field"
            rows="6"
            placeholder="Step by step instructions..."
            required
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1"
          >
            {submitting ? 'Updating...' : 'Update Recipe'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}